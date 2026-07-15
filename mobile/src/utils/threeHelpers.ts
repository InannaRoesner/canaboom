import { Asset } from 'expo-asset';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

/** Minimal WebGLRenderer shim for expo-gl (replaces expo-three on SDK 54). */
export function createExpoRenderer(gl: ExpoWebGLRenderingContext): THREE.WebGLRenderer {
  const fakeCanvas = {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    clientHeight: gl.drawingBufferHeight,
    clientWidth: gl.drawingBufferWidth,
  };

  const renderer = new THREE.WebGLRenderer({
    canvas: fakeCanvas as unknown as HTMLCanvasElement,
    context: gl as unknown as WebGLRenderingContext,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0x09052d, 1);
  return renderer;
}

/** Load a bundled PNG/JPG into a THREE.Texture via expo-asset. */
export async function loadAssetTexture(assetModule: number): Promise<THREE.Texture> {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      uri,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}

/** Boom Beach style isometric orthographic camera. */
export function createIsometricCamera(
  gl: ExpoWebGLRenderingContext,
  target: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  frustum = 14,
): THREE.OrthographicCamera {
  const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const camera = new THREE.OrthographicCamera(
    (-frustum * aspect) / 2,
    (frustum * aspect) / 2,
    frustum / 2,
    -frustum / 2,
    0.1,
    200,
  );

  const distance = 28;
  const pitch = Math.atan(1 / Math.sqrt(2));
  const yaw = Math.PI / 4;
  camera.position.set(
    target.x + distance * Math.cos(pitch) * Math.sin(yaw),
    target.y + distance * Math.sin(pitch),
    target.z + distance * Math.cos(pitch) * Math.cos(yaw),
  );
  camera.lookAt(target);
  return camera;
}

/** Map grid col/row to world XZ (Y = up). Matches 2:1 isometric layout. */
export function gridToWorld(col: number, row: number, tileSize = 1.1): THREE.Vector3 {
  return new THREE.Vector3(
    (col - row) * tileSize * 0.5,
    0,
    (col + row) * tileSize * 0.5,
  );
}

export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex.startsWith('#') ? hex : `#${hex}`);
}
