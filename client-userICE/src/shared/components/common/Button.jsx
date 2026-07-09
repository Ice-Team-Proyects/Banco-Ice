// client-userICE/src/shared/components/common/Button.jsx
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, FONT_SIZE, GRADIENTS, SPACING } from '../../constants/theme';

/**
 * Botón principal de la app (estilo Banco ICE web).
 * variant: 'primary' (pill con degradado carmesí→naranja→arena) | 'secondary' (contorno arena).
 * loading: muestra un spinner y deshabilita el botón.
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  const content = loading ? (
    <ActivityIndicator size="small" color={isPrimary ? COLORS.white : COLORS.sand} />
  ) : (
    <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary, textStyle]}>
      {title}
    </Text>
  );

  if (isPrimary) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.wrapper,
          pressed && styles.pressed,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.base}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles.secondary,
        pressed && styles.secondaryPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 999,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.sand,
  },
  secondaryPressed: {
    backgroundColor: COLORS.sandSoft,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.sand,
  },
});
