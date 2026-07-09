// client-userICE/src/features/auth/screens/RegisterScreen.jsx
// Mismo lenguaje visual que el login web: fondo oscuro y tarjeta crema con borde carmesí.
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

import { useAuth } from '../hooks/useAuth';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from '../../../shared/constants/theme';

const SERIF_FONT = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await handleRegister(values);
    if (result.success) {
      Alert.alert(
        'Registro exitoso',
        result.message || 'Revisa tu correo para verificar tu cuenta.',
        [{ text: 'Aceptar', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Crea tu cuenta</Text>
              <Text style={styles.subtitle}>ÚNETE A BANCO ICE</Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Ingresa tu nombre.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nombre"
                    placeholder="Carlos"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="surname"
                rules={{ required: 'Ingresa tu apellido.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Apellido"
                    placeholder="Pérez"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.surname?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="username"
                rules={{
                  required: 'Ingresa un nombre de usuario.',
                  minLength: { value: 3, message: 'Debe tener al menos 3 caracteres.' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Usuario"
                    placeholder="carlos.perez"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.username?.message}
                    autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Ingresa tu correo.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un correo válido.',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Correo electrónico"
                    placeholder="usuario@bancoice.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Ingresa una contraseña.',
                  minLength: { value: 8, message: 'Debe tener al menos 8 caracteres.' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Contraseña"
                    placeholder="Mínimo 8 caracteres"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                rules={{ required: 'Ingresa tu teléfono.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Teléfono"
                    placeholder="5555-5555"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
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

              <View style={styles.footer}>
                <Text style={styles.footerText}>¿YA TIENES CUENTA? </Text>
                <Pressable onPress={() => navigation.navigate('Login')} disabled={loading}>
                  <Text style={styles.footerLink}>INICIA SESIÓN</Text>
                </Pressable>
              </View>
            </View>
          </View>
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
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: SERIF_FONT,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: SPACING.xs,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    color: COLORS.secondary,
  },
  form: {
    padding: SPACING.lg,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    letterSpacing: 1.5,
  },
  footerLink: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 1.5,
  },
});
