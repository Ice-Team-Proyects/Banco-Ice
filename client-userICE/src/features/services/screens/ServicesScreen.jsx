// client-userICE/src/features/services/screens/ServicesScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useServices } from '../hooks/useServices';
import Button from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import Embers from '../../../shared/components/common/Embers';
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from '../../../shared/constants/theme';

const SERVICE_TYPE_LABELS = {
  DEPOSIT: 'Depósito',
  TRANSFER: 'Transferencia',
  PAYMENT: 'Pago',
  WITHDRAWAL: 'Retiro',
  BALANCE_INQUIRY: 'Consulta de saldo',
};

export default function ServicesScreen({ navigation }) {
  const { services, loading, error, fetchServices } = useServices();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  }, [fetchServices]);

  const renderService = ({ item }) => (
    <Card style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <MaterialIcons name="receipt" size={22} color={COLORS.primary} />
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        {item.isActive === false ? <Text style={styles.inactiveBadge}>Inactivo</Text> : null}
      </View>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      <View style={styles.serviceFooter}>
        <Text style={styles.serviceMeta}>
          {item.serviceCode} · {SERVICE_TYPE_LABELS[item.serviceType] || item.serviceType}
        </Text>
        <Text style={styles.fee}>
          Comisión: {item.currency} {Number(item.transactionFee ?? 0).toFixed(2)}
        </Text>
      </View>
    </Card>
  );

  const showFirstLoad = loading && !refreshing && services.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Embers count={14} />
      <Text style={styles.screenTitle}>Servicios</Text>

      {showFirstLoad ? (
        <LoadingSpinner message="Cargando servicios..." />
      ) : error && services.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" variant="secondary" onPress={fetchServices} />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item, index) => item._id || item.serviceCode || String(index)}
          renderItem={renderService}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="receipt"
              title="Sin servicios"
              message="Aún no hay servicios registrados. Crea el primero con el botón +."
              style={styles.empty}
            />
          }
        />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Crear servicio"
        onPress={() => navigation.navigate('CreateService')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <MaterialIcons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textOnDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl + SPACING.xl,
    flexGrow: 1,
  },
  serviceCard: {
    marginBottom: SPACING.md,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  serviceName: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  inactiveBadge: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.error,
  },
  description: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
  },
  serviceFooter: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
  },
  fee: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    ...SHADOWS.medium,
  },
  fabPressed: {
    backgroundColor: COLORS.primary,
  },
});
