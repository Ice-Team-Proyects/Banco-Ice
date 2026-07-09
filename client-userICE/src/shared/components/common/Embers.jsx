// client-userICE/src/shared/components/common/Embers.jsx
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { COLORS } from '../../constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/** Una brasa: sube desde abajo con oscilación lateral y parpadeo, en bucle. */
function Ember({ size, left, delay, duration, amplitude, color }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(SCREEN_HEIGHT + 60)],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, amplitude, 0],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.5, 0.85, 1],
    outputRange: [0, 0.5, 0.8, 0.35, 0],
  });

  return (
    <Animated.View
      style={[
        styles.ember,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: `${left}%`,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

/**
 * Fondo de brasas ascendentes, réplica de la animación del cliente web
 * (partículas naranja/arena que suben sobre el fondo oscuro).
 */
export default function Embers({ count = 18 }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        delay: Math.random() * 6000,
        duration: Math.random() * 4000 + 5000,
        amplitude: (Math.random() - 0.5) * 70,
        color: i % 3 === 0 ? COLORS.sand : COLORS.accent,
      })),
    [count]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {embers.map((ember) => (
        <Ember key={ember.id} {...ember} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ember: {
    position: 'absolute',
    bottom: -12,
  },
});
