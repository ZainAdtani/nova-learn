import { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

function makeStars(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() < 0.7 ? 2 : 3,
    delay: Math.random() * 3000,
    duration: 2000 + Math.random() * 2000,
  }));
}

function Star({ x, y, size, delay, duration }) {
  const opacity = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration, delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.15, duration, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        opacity,
      }}
    />
  );
}

// A quiet field of twinkling stars, meant to sit behind other content.
export function Starfield({ count = 25 }) {
  const stars = useMemo(() => makeStars(count), [count]);

  return (
    <View style={{ ...StyleAbsoluteFill, overflow: 'hidden' }} pointerEvents="none">
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}
    </View>
  );
}

const StyleAbsoluteFill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };
