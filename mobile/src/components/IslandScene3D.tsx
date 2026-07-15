import React, { useCallback, useEffect, useRef, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';

import * as THREE from 'three';

import GalaxyWaterEffects from './GalaxyWaterEffects';

import type { BaseBuilding } from './BuildingRenderer';

import { MEADOW_COLS, MEADOW_ROWS } from './IsometricBaseGrid';

import { getBuildingTextureModule, resolveBuildingSpriteId } from '../sprites/SpriteRegistry';

import {

  createExpoRenderer,

  createIsometricCamera,

  gridToWorld,

  hexToThreeColor,

  loadAssetTexture,

} from '../utils/threeHelpers';



type Props = {

  buildings: BaseBuilding[];

  compact?: boolean;

  frustum?: number;

  onModeChange?: (mode: '3d' | 'fallback') => void;

};



type SceneBundle = {

  scene: THREE.Scene;

  camera: THREE.OrthographicCamera;

  renderer: THREE.WebGLRenderer;

  gl: ExpoWebGLRenderingContext;

  islandGroup: THREE.Group;

  buildingGroup: THREE.Group;

  oceanMesh: THREE.Mesh;

  oceanTexture: THREE.Texture;

  animationId: number;

};



const TILE_SIZE = 1.05;

const ISLAND_RADIUS = 6.2;



function buildIslandMesh(): THREE.Mesh {

  const geometry = new THREE.CylinderGeometry(ISLAND_RADIUS, ISLAND_RADIUS * 1.08, 0.55, 48, 1);

  const sand = new THREE.MeshStandardMaterial({ color: 0xc8a86a, roughness: 0.92, metalness: 0.04 });

  const mesh = new THREE.Mesh(geometry, sand);

  mesh.position.y = 0.12;

  mesh.receiveShadow = true;

  mesh.castShadow = true;

  return mesh;

}



function buildGrassCap(): THREE.Mesh {

  const geometry = new THREE.CylinderGeometry(ISLAND_RADIUS * 0.88, ISLAND_RADIUS * 0.92, 0.18, 48, 1);

  const grass = new THREE.MeshStandardMaterial({ color: 0x5a8f3c, roughness: 0.88, metalness: 0.02 });

  const mesh = new THREE.Mesh(geometry, grass);

  mesh.position.y = 0.38;

  return mesh;

}



function buildBoxFallback(building: BaseBuilding): THREE.Group {

  const size = building.size ?? 1;

  const footprint = size * TILE_SIZE * 0.92;

  const height =

    building.type === 'hq' ? 1.8 :

    building.type === 'defense' ? 1.2 :

    building.type === 'storage' ? 0.9 :

    0.75;



  const group = new THREE.Group();

  const base = new THREE.Mesh(

    new THREE.BoxGeometry(footprint, height, footprint),

    new THREE.MeshStandardMaterial({

      color: hexToThreeColor(building.color),

      roughness: 0.72,

      metalness: building.type === 'defense' ? 0.35 : 0.08,

    }),

  );

  base.position.y = height / 2 + 0.42;

  base.castShadow = true;

  group.add(base);



  if (building.type === 'hq') {

    const roof = new THREE.Mesh(

      new THREE.ConeGeometry(footprint * 0.55, 0.55, 4),

      new THREE.MeshStandardMaterial({ color: 0x4a5a32, roughness: 0.8 }),

    );

    roof.position.y = height + 0.65;

    roof.rotation.y = Math.PI / 4;

    group.add(roof);

  }



  return group;

}



async function buildSpriteBillboard(building: BaseBuilding, camera: THREE.Camera): Promise<THREE.Group> {

  const size = building.size ?? 1;

  const group = new THREE.Group();

  const resolvedId = resolveBuildingSpriteId(building);

  const module = resolvedId ? getBuildingTextureModule(resolvedId) : null;



  if (module) {

    try {

      const texture = await loadAssetTexture(module);

      texture.wrapS = THREE.ClampToEdgeWrapping;

      texture.wrapT = THREE.ClampToEdgeWrapping;



      const spriteH = 1.6 + size * 0.35;

      const spriteW = spriteH * 0.72;

      const geometry = new THREE.PlaneGeometry(spriteW, spriteH);

      const material = new THREE.MeshBasicMaterial({

        map: texture,

        transparent: true,

        alphaTest: 0.08,

        depthWrite: false,

        side: THREE.DoubleSide,

      });

      const plane = new THREE.Mesh(geometry, material);

      plane.position.y = 0.55 + spriteH * 0.42;

      plane.onBeforeRender = () => {

        plane.quaternion.copy(camera.quaternion);

      };

      group.add(plane);



      const shadow = new THREE.Mesh(

        new THREE.CircleGeometry(spriteW * 0.38, 24),

        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 }),

      );

      shadow.rotation.x = -Math.PI / 2;

      shadow.position.y = 0.44;

      group.add(shadow);



      return group;

    } catch {

      // fall through to box fallback

    }

  }



  group.add(buildBoxFallback(building));

  return group;

}



async function buildBuildingMesh(building: BaseBuilding, camera: THREE.Camera): Promise<THREE.Group> {

  const size = building.size ?? 1;

  const group = await buildSpriteBillboard(building, camera);

  const pos = gridToWorld(building.col + (size - 1) * 0.5, building.row + (size - 1) * 0.5, TILE_SIZE);

  group.position.copy(pos);

  group.userData.buildingId = building.id;

  return group;

}



function disposeGroup(group: THREE.Group) {

  group.traverse((obj) => {

    if (obj instanceof THREE.Mesh) {

      obj.geometry.dispose();

      const mat = obj.material;

      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());

      else mat.dispose();

    }

  });

}



async function syncBuildings(

  group: THREE.Group,

  buildings: BaseBuilding[],

  camera: THREE.Camera,

) {

  const existing = new Map<string, THREE.Group>();

  group.children.forEach((child) => {

    if (child.userData.buildingId) {

      existing.set(child.userData.buildingId as string, child as THREE.Group);

    }

  });



  const nextIds = new Set(buildings.map((b) => b.id));

  existing.forEach((mesh, id) => {

    if (!nextIds.has(id)) {

      group.remove(mesh);

      disposeGroup(mesh);

    }

  });



  await Promise.all(

    buildings.map(async (building) => {

      const current = existing.get(building.id);

      if (current) {

        const size = building.size ?? 1;

        const pos = gridToWorld(building.col + (size - 1) * 0.5, building.row + (size - 1) * 0.5, TILE_SIZE);

        current.position.copy(pos);

        return;

      }

      const mesh = await buildBuildingMesh(building, camera);

      group.add(mesh);

    }),

  );

}



function disposeScene(bundle: SceneBundle) {

  cancelAnimationFrame(bundle.animationId);

  bundle.buildingGroup.traverse((obj) => {

    if (obj instanceof THREE.Mesh) {

      obj.geometry.dispose();

      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());

      else obj.material.dispose();

    }

  });

  bundle.islandGroup.traverse((obj) => {

    if (obj instanceof THREE.Mesh) {

      obj.geometry.dispose();

      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());

      else obj.material.dispose();

    }

  });

  bundle.oceanTexture.dispose();

  bundle.renderer.dispose();

}



export default function IslandScene3D({ buildings, compact = false, frustum = 14, onModeChange }: Props) {

  const [useFallback, setUseFallback] = useState(false);

  const bundleRef = useRef<SceneBundle | null>(null);

  const buildingsRef = useRef(buildings);

  buildingsRef.current = buildings;



  const activateFallback = useCallback(() => {

    setUseFallback(true);

    onModeChange?.('fallback');

  }, [onModeChange]);



  useEffect(() => {

    if (useFallback) return undefined;

    return () => {

      if (bundleRef.current) {

        disposeScene(bundleRef.current);

        bundleRef.current = null;

      }

    };

  }, [useFallback]);



  useEffect(() => {

    if (useFallback || !bundleRef.current) return;

    void syncBuildings(bundleRef.current.buildingGroup, buildings, bundleRef.current.camera);

  }, [buildings, useFallback]);



  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {

    try {

      const renderer = createExpoRenderer(gl);

      const scene = new THREE.Scene();

      scene.background = new THREE.Color(0x09052d);

      scene.fog = new THREE.Fog(0x12083a, 18, 42);



      const gridCenter = gridToWorld(

        (MEADOW_COLS - 1) / 2,

        (MEADOW_ROWS - 1) / 2,

        TILE_SIZE,

      );

      const camera = createIsometricCamera(gl, gridCenter, frustum);



      scene.add(new THREE.AmbientLight(0xbba0ff, 0.55));

      const sun = new THREE.DirectionalLight(0xffe8c8, 1.1);

      sun.position.set(8, 14, 6);

      scene.add(sun);

      const rim = new THREE.DirectionalLight(0x9f6bff, 0.45);

      rim.position.set(-6, 4, -8);

      scene.add(rim);



      const oceanTexture = await loadAssetTexture(

        require('../../assets/images/base/ocean_bloom_seamless.png'),

      );

      oceanTexture.repeat.set(compact ? 3 : 4, compact ? 3 : 4);



      const oceanGeometry = new THREE.PlaneGeometry(48, 48, 1, 1);

      const oceanMaterial = new THREE.MeshStandardMaterial({

        map: oceanTexture,

        color: 0xc88cff,

        emissive: 0x3a1578,

        emissiveIntensity: 0.22,

        roughness: 0.35,

        metalness: 0.08,

        side: THREE.DoubleSide,

      });

      const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);

      oceanMesh.rotation.x = -Math.PI / 2;

      oceanMesh.position.set(gridCenter.x, -0.05, gridCenter.z);

      scene.add(oceanMesh);



      const islandGroup = new THREE.Group();

      islandGroup.add(buildIslandMesh());

      islandGroup.add(buildGrassCap());

      islandGroup.position.set(gridCenter.x, 0, gridCenter.z);

      scene.add(islandGroup);



      const buildingGroup = new THREE.Group();

      await syncBuildings(buildingGroup, buildingsRef.current, camera);

      scene.add(buildingGroup);



      const clock = new THREE.Clock();

      let animationId = 0;

      const animate = () => {

        animationId = requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        oceanTexture.offset.x = Math.sin(t * 0.12) * 0.015;

        oceanTexture.offset.y = Math.cos(t * 0.09) * 0.01;

        oceanMesh.position.y = -0.05 + Math.sin(t * 0.55) * 0.03;

        renderer.render(scene, camera);

        gl.endFrameEXP();

      };

      animate();



      bundleRef.current = {

        scene,

        camera,

        renderer,

        gl,

        islandGroup,

        buildingGroup,

        oceanMesh,

        oceanTexture,

        animationId,

      };

      onModeChange?.('3d');

    } catch {

      activateFallback();

    }

  }, [activateFallback, compact, frustum, onModeChange]);



  if (useFallback) {

    return <GalaxyWaterEffects compact={compact} />;

  }



  return (

    <View style={styles.container} pointerEvents="none">

      <GLView style={styles.glView} onContextCreate={onContextCreate} />

    </View>

  );

}



const styles = StyleSheet.create({

  container: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },

  glView: { flex: 1 },

});


