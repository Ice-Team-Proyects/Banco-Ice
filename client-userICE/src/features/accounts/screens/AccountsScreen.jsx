// client-userICE/src/features/accounts/screens/AccountsScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAccounts } from '../hooks/useAccounts';
import Button from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import Embers from '../../../shared/components/common/Embers';
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from '../../../shared/constants/theme';

const ACCOUNT_TYPE_LABELS = {
  SAVINGS: 'Ahorro',
  CHECKING: 'Monetaria',
};

export default function AccountsScreen({ navigation }) {
  const { accounts, loading, error, fetchAccounts } = useAccounts();
  const [refreshing, setRefreshing] = useState(false);

  // Recargar cada vez que la pantalla vuelve a tener foco (p. ej. tras crear una cuenta).
  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [fetchAccounts])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAccounts();
    setRefreshing(false);
  }, [fetchAccounts]);

  const renderAccount = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('AccountBalance', { accountNumber: item.accountNumber })}
    >
      <Card style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <MaterialIcons name="account-balance-wallet" size={24} color={COLORS.primary} />
          <Text style={styles.accountNumber}>{item.accountNumber}</Text>
          <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
        </View>
        <Text style={styles.ownerName}>{item.ownerName}</Text>
        <View style={styles.accountFooter}>
          <Text style={styles.accountType}>
            {ACCOUNT_TYPE_LABELS[item.accountType] || item.accountType}
          </Text>
          <Text style={styles.balance}>
            {item.currency} {Number(item.balance ?? 0).toFixed(2)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );

  const showFirstLoad = loading && !refreshing && accounts.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Embers count={14} />
      <Text style={styles.screenTitle}>Mis cuentas</Text>

      {showFirstLoad ? (
        <LoadingSpinner message="Cargando cuentas..." />
      ) : error && accounts.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" variant="secondary" onPress={fetchAccounts} />
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item, index) => item._id || item.accountNumber || String(index)}
          renderItem={renderAccount}
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
              icon="account-balance"
              title="Sin cuentas"
              message="Aún no tienes cuentas registradas. Crea la primera con el botón +."
              style={styles.empty}
            />
          }
        />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Crear cuenta"
        onPress={() => navigation.navigate('CreateAccount')}
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
  accountCard: {
    marginBottom: SPACING.md,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  accountNumber: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  ownerName: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
  },
  accountFooter: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountType: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.secondary,
    textTransform: 'uppercase',
  },
  balance: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
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
