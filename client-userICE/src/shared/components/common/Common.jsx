// client-userICE/src/shared/components/common/Common.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZE, SHADOWS, SPACING } from '../../constants/theme';

/** Indicador de carga centrado, con mensaje opcional (sobre el fondo oscuro). */
export function LoadingSpinner({ message = 'Cargando...', size = 'large', style }) {
  return (
    <View style={[styles.center, style]}>
      <ActivityIndicator size={size} color={COLORS.accent} />
      {message ? <Text style={styles.loadingText}>{message}</Text> : null}
    </View>
  );
}

/** Estado vacío para listados sin datos (ícono de MaterialIcons + título + mensaje). */
export function EmptyState({
  icon = 'inbox',
  title = 'Sin resultados',
  message = 'No hay información para mostrar.',
  children,
  style,
}) {
  return (
    <View style={[styles.center, style]}>
      <MaterialIcons name={icon} size={48} color={COLORS.sand} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {children}
    </View>
  );
}

/** Tarjeta crema marfil con borde izquierdo carmesí, como las tarjetas del cliente web. */
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  emptyTitle: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textOnDark,
  },
  emptyMessage: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
});
