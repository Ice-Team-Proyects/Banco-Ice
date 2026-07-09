// client-userICE/src/features/accounts/screens/CreateAccountScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAccounts } from '../hooks/useAccounts';
import Button from '../../../shared/components/common/Button';
import { Card } from '../../../shared/components/common/Common';
import Input from '../../../shared/components/common/Input';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

const ACCOUNT_TYPES = [
  { value: 'SAVINGS', label: 'Ahorro' },
  { value: 'CHECKING', label: 'Monetaria' },
];

const CURRENCIES = [
  { value: 'GTQ', label: 'Quetzales (GTQ)' },
  { value: 'USD', label: 'Dólares (USD)' },
];

function OptionChips({ label, options, value, onChange, error }) {
  return (
    <View style={styles.chipsContainer}>
      <Text style={styles.chipsLabel}>{label}</Text>
      <View style={styles.chipsRow}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.chipsError}>{error}</Text> : null}
    </View>
  );
}

export default function CreateAccountScreen({ navigation }) {
  const { createAccount, loading, error } = useAccounts();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountType: 'SAVINGS',
      ownerName: '',
      ownerDPI: '',
      currency: 'GTQ',
      dailyLimit: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await createAccount(values);
    if (result.success) {
      Alert.alert('Cuenta creada', result.message || 'La cuenta se registró exitosamente.', [
        { text: 'Aceptar', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Card style={styles.formCard}>
          <Controller
            control={control}
            name="accountType"
            rules={{ required: 'Selecciona el tipo de cuenta.' }}
            render={({ field: { onChange, value } }) => (
              <OptionChips
                label="Tipo de cuenta"
                options={ACCOUNT_TYPES}
                value={value}
                onChange={onChange}
                error={errors.accountType?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="ownerName"
            rules={{ required: 'Ingresa el nombre del titular.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre del titular"
                placeholder="Carlos Pérez"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.ownerName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="ownerDPI"
            rules={{
              required: 'Ingresa el DPI del titular.',
              minLength: { value: 13, message: 'El DPI debe tener 13 dígitos.' },
              maxLength: { value: 13, message: 'El DPI debe tener 13 dígitos.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="DPI del titular"
                placeholder="1543789270987"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.ownerDPI?.message}
                keyboardType="number-pad"
                maxLength={13}
              />
            )}
          />

          <Controller
            control={control}
            name="currency"
            rules={{ required: 'Selecciona la moneda.' }}
            render={({ field: { onChange, value } }) => (
              <OptionChips
                label="Moneda"
                options={CURRENCIES}
                value={value}
                onChange={onChange}
                error={errors.currency?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="dailyLimit"
            rules={{
              validate: (v) =>
                !v || Number(v) > 0 || 'El límite diario debe ser un número mayor a 0.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Límite diario (opcional)"
                placeholder="10000"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.dailyLimit?.message}
                keyboardType="numeric"
              />
            )}
          />

          {error ? <Text style={styles.apiError}>{error}</Text> : null}

          <Button
            title="Crear cuenta"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submit}
          />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
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
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  formCard: {
    padding: SPACING.lg,
  },
  chipsContainer: {
    marginBottom: SPACING.md,
  },
  chipsLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  chipsError: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
  },
  apiError: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  submit: {
    marginTop: SPACING.sm,
  },
});
