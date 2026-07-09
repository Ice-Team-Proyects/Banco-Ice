// client-userICE/src/shared/components/common/Input.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS, FONT_SIZE, SPACING } from '../../constants/theme';

/**
 * Campo de texto con etiqueta y mensaje de error (pensado para react-hook-form).
 * Acepta `ref` como prop (React 19) para poder enfocar el campo desde el formulario.
 * Si recibe `secureTextEntry`, agrega el botón de mostrar/ocultar contraseña (como la web).
 * El resto de props se pasan directo al TextInput (value, onChangeText, keyboardType, etc.).
 */
export default function Input({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry = false,
  ref,
  ...inputProps
}) {
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={isPassword && hidden}
          style={[
            styles.input,
            isPassword && styles.inputWithIcon,
            error && styles.inputError,
            inputStyle,
          ]}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <MaterialIcons
              name={hidden ? 'visibility' : 'visibility-off'}
              size={20}
              color={COLORS.secondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputWithIcon: {
    paddingRight: SPACING.xl + SPACING.sm,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  eyeButton: {
    position: 'absolute',
    right: SPACING.md,
  },
  errorText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
  },
  helperText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
});
