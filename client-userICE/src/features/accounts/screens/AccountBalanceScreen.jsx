// client-userICE/src/features/accounts/screens/AccountBalanceScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAccounts } from '../hooks/useAccounts';
import Button from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

const ACCOUNT_TYPE_LABELS = {
  SAVINGS: 'Ahorro',
  CHECKING: 'Monetaria',
};

export default function AccountBalanceScreen({ navigation, route }) {
  const { accountNumber } = route.params ?? {};
  const { getBalance, loading, error } = useAccounts();
  const [balanceInfo, setBalanceInfo] = useState(null);

  const loadBalance = useCallback(async () => {
    if (!accountNumber) return;
    const result = await getBalance(accountNumber);
    if (result.success) {
      setBalanceInfo(result.data);
    }
  }, [accountNumber, getBalance]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Saldo de cuenta</Text>
      </View>

      {loading ? (
        <LoadingSpinner message="Consultando saldo..." />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" variant="secondary" onPress={loadBalance} />
        </View>
      ) : balanceInfo ? (
        <View style={styles.content}>
          <Card style={styles.balanceCard}>
            <MaterialIcons name="account-balance-wallet" size={40} color={COLORS.primary} />
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <Text style={styles.balanceAmount}>
              {balanceInfo.currency} {Number(balanceInfo.balance ?? 0).toFixed(2)}
            </Text>
          </Card>

          <Card style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Número de cuenta</Text>
              <Text style={styles.detailValue}>{balanceInfo.accountNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Titular</Text>
              <Text style={styles.detailValue}>{balanceInfo.ownerName}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Tipo de cuenta</Text>
              <Text style={styles.detailValue}>
                {ACCOUNT_TYPE_LABELS[balanceInfo.accountType] || balanceInfo.accountType}
              </Text>
            </View>
          </Card>

          <Button title="Actualizar saldo" variant="secondary" onPress={loadBalance} />
        </View>
      ) : (
        <EmptyState
          icon="error-outline"
          title="Sin información"
          message="No se pudo obtener la información de la cuenta."
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textOnDark,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  balanceLabel: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
  },
  balanceAmount: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.title,
    fontWeight: '700',
    color: COLORS.primary,
  },
  detailCard: {
    paddingVertical: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
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
});
