// client-userICE/src/features/services/screens/CreateServiceScreen.jsx
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

import { useServices } from '../hooks/useServices';
import Button from '../../../shared/components/common/Button';
import { Card } from '../../../shared/components/common/Common';
import Input from '../../../shared/components/common/Input';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

const SERVICE_TYPES = [
  { value: 'DEPOSIT', label: 'Depósito' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'PAYMENT', label: 'Pago' },
  { value: 'WITHDRAWAL', label: 'Retiro' },
  { value: 'BALANCE_INQUIRY', label: 'Consulta de saldo' },
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

export default function CreateServiceScreen({ navigation }) {
  const { createService, loading, error } = useServices();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceName: '',
      serviceCode: '',
      serviceType: 'PAYMENT',
      description: '',
      transactionFee: '',
      currency: 'GTQ',
    },
  });

  const onSubmit = async (values) => {
    const result = await createService(values);
    if (result.success) {
      Alert.alert('Servicio creado', result.message || 'El servicio se registró exitosamente.', [
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
        <Text style={styles.headerTitle}>Crear servicio</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Card style={styles.formCard}>
          <Controller
            control={control}
            name="serviceName"
            rules={{ required: 'Ingresa el nombre del servicio.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre del servicio"
                placeholder="Pago de Energía"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.serviceName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="serviceCode"
            rules={{ required: 'Ingresa el código del servicio.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Código"
                placeholder="ENERGY001"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.serviceCode?.message}
                autoCapitalize="characters"
              />
            )}
          />

          <Controller
            control={control}
            name="serviceType"
            rules={{ required: 'Selecciona el tipo de servicio.' }}
            render={({ field: { onChange, value } }) => (
              <OptionChips
                label="Tipo de servicio"
                options={SERVICE_TYPES}
                value={value}
                onChange={onChange}
                error={errors.serviceType?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descripción (opcional)"
                placeholder="Pago de servicio eléctrico"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="transactionFee"
            rules={{
              validate: (v) => !v || Number(v) >= 0 || 'La comisión debe ser un número válido.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Comisión por transacción (opcional)"
                placeholder="5.00"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.transactionFee?.message}
                keyboardType="numeric"
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

          {error ? <Text style={styles.apiError}>{error}</Text> : null}

          <Button
            title="Registrar servicio"
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
