import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";

interface Particle {
  leftPct: number;
  translateY: Animated.Value;
  opacity: Animated.Value;
  size: number;
  duration: number;
  delay: number;
}

const PARTICLE_COUNT = 18;

function makeParticle(index: number): Particle {
  const seed = (index * 137.508 + 33) % 100;
  return {
    leftPct: seed,
    translateY: new Animated.Value(0),
    opacity: new Animated.Value(0),
    size: 1.5 + (seed % 2.5),
    duration: 7000 + (index * 1117) % 6000,
    delay: (index * 430) % 4000,
  };
}

function ParticleView({
  p,
  containerHeight,
  reduceMotion,
}: {
  p: Particle;
  containerHeight: number;
  reduceMotion: boolean;
}) {
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const travel = containerHeight > 0 ? containerHeight + p.size + 4 : 400;

  useEffect(() => {
    if (reduceMotion) {
      p.opacity.setValue(0);
      return;
    }
    if (containerHeight <= 0) return;

    const animate = () => {
      p.translateY.setValue(travel);
      p.opacity.setValue(0);

      loopRef.current = Animated.sequence([
        Animated.delay(p.delay),
        Animated.parallel([
          Animated.timing(p.translateY, {
            toValue: -p.size - 4,
            duration: p.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, {
              toValue: 0.9,
              duration: p.duration * 0.15,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0.45,
              duration: p.duration * 0.65,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: p.duration * 0.2,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);

      loopRef.current.start(({ finished }) => {
        if (finished) animate();
      });
    };

    animate();
    return () => { loopRef.current?.stop(); };
  }, [reduceMotion, containerHeight, travel, p]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          left: `${p.leftPct}%` as any,
          bottom: 0,
          opacity: p.opacity,
          transform: [{ translateY: p.translateY }],
        },
      ]}
      pointerEvents="none"
    />
  );
}

export function NorthernAtmosphere({
  reduceMotion: reduceProp = false,
  style,
}: {
  reduceMotion?: boolean;
  style?: object;
}) {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => makeParticle(i)),
  ).current;

  const [containerHeight, setContainerHeight] = React.useState(0);

  let reduceMotion = reduceProp;
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) reduceMotion = true;
  }

  return (
    <View
      style={[StyleSheet.absoluteFillObject, styles.container, style]}
      pointerEvents="none"
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      {particles.map((p, i) => (
        <ParticleView
          key={i}
          p={p}
          containerHeight={containerHeight}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
    backgroundColor: "rgba(244,237,224,0.75)",
  },
});
