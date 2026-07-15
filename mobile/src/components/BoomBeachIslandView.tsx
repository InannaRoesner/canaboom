import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { PinchGestureHandler, State, type PinchGestureHandlerGestureEvent, type PinchGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { BOOM_BEACH_ISLAND, BOOM_BEACH_PALETTE } from '../config/boomBeachLayout';

type Props = {
  children?: React.ReactNode;
  onTransformChange?: (tx: number, ty: number, zoom: number) => void;
};

export default function BoomBeachIslandView({ children, onTransformChange }: Props) {
  const [layout, setLayout] = useState({ width: 800, height: 400 });
  const pan = useRef({ x: 0, y: 0 }).current;
  const zoomRef = useRef(BOOM_BEACH_ISLAND.defaultZoom);
  const basePinchScale = useRef(1);
  const panAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const zoomAnim = useRef(new Animated.Value(BOOM_BEACH_ISLAND.defaultZoom)).current;
  const shimmer = useRef(new Animated.Value(0.12)).current;
  const waterShift = useRef(new Animated.Value(0)).current;
  const moveGlow = useRef(new Animated.Value(0)).current;
  const isMoving = useRef(false);

  const imageSize = useMemo(() => {
    const aspect = 16 / 9;
    const viewAspect = layout.width / layout.height;
    if (viewAspect > aspect) {
      const h = layout.height;
      return { width: h * aspect, height: h };
    }
    const w = layout.width;
    return { width: w, height: w / aspect };
  }, [layout.height, layout.width]);

  const boostShimmer = useCallback(() => {
    if (isMoving.current) return;
    isMoving.current = true;
    Animated.parallel([
      Animated.timing(moveGlow, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(shimmer, {
        toValue: 0.28 + BOOM_BEACH_ISLAND.shimmerBoostOnMove,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [moveGlow, shimmer]);

  const relaxShimmer = useCallback(() => {
    isMoving.current = false;
    Animated.parallel([
      Animated.timing(moveGlow, { toValue: 0, duration: 480, useNativeDriver: true }),
      Animated.timing(shimmer, { toValue: 0.12, duration: 480, useNativeDriver: true }),
    ]).start();
  }, [moveGlow, shimmer]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(waterShift, { toValue: 1, duration: 3200, useNativeDriver: true }),
        Animated.timing(waterShift, { toValue: 0, duration: 3200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [waterShift]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
        onPanResponderGrant: boostShimmer,
        onPanResponderMove: (_, g) => {
          const nx = pan.x + g.dx;
          const ny = pan.y + g.dy;
          const maxX = imageSize.width * 0.22;
          const maxY = imageSize.height * 0.18;
          pan.x = Math.max(-maxX, Math.min(maxX, nx));
          pan.y = Math.max(-maxY, Math.min(maxY, ny));
          panAnim.setValue({ x: pan.x, y: pan.y });
          waterShift.setValue((pan.x / maxX) * 0.5 + 0.5);
          onTransformChange?.(pan.x, pan.y, zoomRef.current);
        },
        onPanResponderRelease: relaxShimmer,
        onPanResponderTerminate: relaxShimmer,
      }),
    [boostShimmer, imageSize.height, imageSize.width, onTransformChange, pan, panAnim, relaxShimmer, waterShift],
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  const waterParallaxX = panAnim.x.interpolate({
    inputRange: [-200, 200],
    outputRange: [12, -12],
    extrapolate: 'clamp',
  });
  const waterDrift = waterShift.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  const onPinchGesture = useCallback((e: PinchGestureHandlerGestureEvent) => {
      if (e.nativeEvent.state !== State.ACTIVE) return;
      const next = Math.max(
        BOOM_BEACH_ISLAND.minZoom,
        Math.min(BOOM_BEACH_ISLAND.maxZoom, basePinchScale.current * e.nativeEvent.scale),
      );
      zoomRef.current = next;
      zoomAnim.setValue(next);
  }, [zoomAnim]);

  const onPinchStateChange = useCallback(
    (e: PinchGestureHandlerStateChangeEvent) => {
      if (e.nativeEvent.state === State.BEGAN) {
        basePinchScale.current = zoomRef.current;
        boostShimmer();
      }
      if (e.nativeEvent.state === State.ACTIVE) {
        const next = Math.max(
          BOOM_BEACH_ISLAND.minZoom,
          Math.min(BOOM_BEACH_ISLAND.maxZoom, basePinchScale.current * e.nativeEvent.scale),
        );
        zoomRef.current = next;
        zoomAnim.setValue(next);
      }
      if (e.nativeEvent.oldState === State.ACTIVE) {
        relaxShimmer();
        onTransformChange?.(pan.x, pan.y, zoomRef.current);
      }
    },
    [boostShimmer, onTransformChange, pan.x, pan.y, relaxShimmer, zoomAnim],
  );

  return (
    <View style={styles.root} onLayout={onLayout}>
      <PinchGestureHandler onGestureEvent={onPinchGesture} onHandlerStateChange={onPinchStateChange}>
        <Animated.View style={styles.flex} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.islandWrap,
              {
                width: imageSize.width,
                height: imageSize.height,
                transform: [
                  { translateX: panAnim.x },
                  { translateY: panAnim.y },
                  { scale: zoomAnim },
                ],
              },
            ]}
          >
            <Image
              source={BOOM_BEACH_ISLAND.masterAsset}
              style={[styles.masterImage, { width: imageSize.width, height: imageSize.height }]}
              resizeMode="cover"
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.waterShimmer,
                {
                  opacity: shimmer,
                  transform: [{ translateX: Animated.add(waterParallaxX, waterDrift) }],
                },
              ]}
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.sunWash,
                {
                  opacity: moveGlow.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.18] }),
                },
              ]}
            />

            <View style={styles.childrenLayer}>{children}</View>
          </Animated.View>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: BOOM_BEACH_PALETTE.waterDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  islandWrap: { position: 'relative' },
  masterImage: { borderRadius: 2 },
  waterShimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BOOM_BEACH_PALETTE.waterShallow,
  },
  sunWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff8e8',
  },
  childrenLayer: { ...StyleSheet.absoluteFillObject },
  vignette: { ...StyleSheet.absoluteFillObject },
});
