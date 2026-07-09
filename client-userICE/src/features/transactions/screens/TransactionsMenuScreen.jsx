// client-userICE/src/features/transactions/screens/TransactionsMenuScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../../shared/components/common/Common';
import Embers from '../../../shared/components/common/Embers';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

const OPTIONS = [
  {
    type: 'DEPOSIT',
    title: 'Depósito',
    description: 'Abona dinero a una cuenta',
    icon: 'arrow-downward',
  },
  {
    type: 'WITHDRAWAL',
    title: 'Retiro',
    description: 'Retira fondos de tu cuenta',
    icon: 'arrow-upward',
  },
  {
    type: 'TRANSFER',
    title: 'Transferencia',
    description: 'Envía dinero a otra cuenta',
    icon: 'swap-horiz',
  },
  {
    type: 'PAYMENT',
    title: 'Pago',
    description: 'Paga un servicio con referencia',
    icon: 'receipt-long',
  },
];

export default function TransactionsMenuScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Embers count={14} />
      <Text style={styles.screenTitle}>Transacciones</Text>
      <Text style={styles.screenSubtitle}>Elige la operación que quieres realizar</Text>

      <View style={styles.options}>
        {OPTIONS.map((option) => (
          <Pressable
            key={option.type}
            onPress={() => navigation.navigate('TransactionForm', { type: option.type })}
          >
            <Card style={styles.optionCard}>
              <View style={styles.iconCircle}>
                <MaterialIcons name={option.icon} size={26} color={COLORS.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
            </Card>
          </Pressable>
        ))}
      </View>
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
    paddingTop: SPACING.md,
  },
  screenSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  options: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionDescription: {
    marginTop: 2,
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
  },
});
