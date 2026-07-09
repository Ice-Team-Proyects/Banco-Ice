// client-userICE/src/features/transactions/screens/TransactionFormScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
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

import { useTransactions } from '../hooks/useTransactions';
import { useServices } from '../../services/hooks/useServices';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

const TRANSACTION_CONFIG = {
  DEPOSIT: {
    title: 'Depósito',
    accountLabel: 'Cuenta a acreditar',
    submitLabel: 'Realizar depósito',
  },
  WITHDRAWAL: {
    title: 'Retiro',
    accountLabel: 'Cuenta de origen',
    submitLabel: 'Realizar retiro',
  },
  TRANSFER: {
    title: 'Transferencia',
    accountLabel: 'Cuenta de origen',
    submitLabel: 'Realizar transferencia',
  },
  PAYMENT: {
    title: 'Pago de servicio',
    accountLabel: 'Cuenta de origen',
    submitLabel: 'Realizar pago',
  },
};

export default function TransactionFormScreen({ navigation, route }) {
  const type = route.params?.type ?? 'DEPOSIT';
  const config = TRANSACTION_CONFIG[type] ?? TRANSACTION_CONFIG.DEPOSIT;

  const { makeDeposit, makeWithdrawal, makeTransfer, makePayment, loading, error } =
    useTransactions();
  const {
    services,
    loading: servicesLoading,
    fetchServices,
  } = useServices();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // El backend exige un servicio (fieldService) en toda operación; se priorizan
  // los del mismo tipo que la transacción y, si no hay, se muestran todos.
  const availableServices = useMemo(() => {
    const active = services.filter((service) => service.isActive !== false);
    const matching = active.filter((service) => service.serviceType === type);
    return matching.length > 0 ? matching : active;
  }, [services, type]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: '',
      destinationAccountNumber: '',
      externalReference: '',
      amount: '',
      fieldService: '',
      description: '',
    },
  });

  const onSubmit = async (values) => {
    const base = {
      amount: values.amount,
      fieldService: values.fieldService,
      description: values.description || undefined,
    };

    let result;
    if (type === 'DEPOSIT') {
      result = await makeDeposit({ ...base, accountNumber: values.account });
    } else if (type === 'WITHDRAWAL') {
      result = await makeWithdrawal({ ...base, sourceAccountNumber: values.account });
    } else if (type === 'TRANSFER') {
      result = await makeTransfer({
        ...base,
        sourceAccountNumber: values.account,
        destinationAccountNumber: values.destinationAccountNumber,
      });
    } else {
      result = await makePayment({
        ...base,
        sourceAccountNumber: values.account,
        externalReference: values.externalReference || undefined,
      });
    }

    if (result.success) {
      const newBalance = result.data?.updatedBalance;
      Alert.alert(
        'Operación exitosa',
        `${result.message || 'La transacción se procesó correctamente.'}${
          newBalance !== undefined ? `\nNuevo saldo: ${Number(newBalance).toFixed(2)}` : ''
        }`,
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>{config.title}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Card style={styles.formCard}>
          <Controller
            control={control}
            name="account"
            rules={{ required: 'Ingresa el número de cuenta.' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={config.accountLabel}
                placeholder="GTQ-5649300566"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.account?.message}
                autoCapitalize="characters"
              />
            )}
          />

          {type === 'TRANSFER' ? (
            <Controller
              control={control}
              name="destinationAccountNumber"
              rules={{ required: 'Ingresa la cuenta destino.' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Cuenta destino"
                  placeholder="GTQ-7080358366"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.destinationAccountNumber?.message}
                  autoCapitalize="characters"
                />
              )}
            />
          ) : null}

          {type === 'PAYMENT' ? (
            <Controller
              control={control}
              name="externalReference"
              rules={{ required: 'Ingresa la referencia del pago.' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Referencia del servicio"
                  placeholder="AGUA-2026-001"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.externalReference?.message}
                  autoCapitalize="characters"
                />
              )}
            />
          ) : null}

          <Controller
            control={control}
            name="amount"
            rules={{
              required: 'Ingresa el monto.',
              validate: (v) => Number(v) > 0 || 'El monto debe ser mayor a 0.',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Monto"
                placeholder="100.00"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.amount?.message}
                keyboardType="numeric"
              />
            )}
          />

          <Controller
            control={control}
            name="fieldService"
            rules={{ required: 'Selecciona el servicio asociado.' }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.servicesContainer}>
                <Text style={styles.servicesLabel}>Servicio</Text>
                {servicesLoading ? (
                  <LoadingSpinner message="Cargando servicios..." style={styles.servicesLoading} />
                ) : availableServices.length === 0 ? (
                  <Text style={styles.servicesEmpty}>
                    No hay servicios disponibles. Registra uno en la pestaña Servicios.
                  </Text>
                ) : (
                  availableServices.map((service) => {
                    const id = service._id || service.id;
                    const selected = value === id;
                    return (
                      <Pressable
                        key={id}
                        onPress={() => onChange(id)}
                        style={[styles.serviceOption, selected && styles.serviceOptionSelected]}
                      >
                        <MaterialIcons
                          name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                          size={20}
                          color={selected ? COLORS.primary : COLORS.textLight}
                        />
                        <View style={styles.serviceText}>
                          <Text style={styles.serviceName}>{service.serviceName}</Text>
                          <Text style={styles.serviceMeta}>
                            {service.serviceCode} · Comisión: {service.currency}{' '}
                            {Number(service.transactionFee ?? 0).toFixed(2)}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })
                )}
                {errors.fieldService ? (
                  <Text style={styles.servicesError}>{errors.fieldService.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descripción (opcional)"
                placeholder="Motivo de la operación"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {error ? <Text style={styles.apiError}>{error}</Text> : null}

          <Button
            title={config.submitLabel}
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
  servicesContainer: {
    marginBottom: SPACING.md,
  },
  servicesLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  servicesLoading: {
    flex: 0,
    paddingVertical: SPACING.md,
  },
  servicesEmpty: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  serviceOptionSelected: {
    borderColor: COLORS.primary,
  },
  serviceText: {
    flex: 1,
  },
  serviceName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  serviceMeta: {
    marginTop: 2,
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
  },
  servicesError: {
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
