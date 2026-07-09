// client-userICE/src/features/auth/screens/LoginScreen.jsx
// Réplica móvil del "Hinokami Portal" del cliente web: fondo oscuro con brasas
// animadas, tarjeta crema con borde carmesí, inputs subrayados y botón degradado.
import { MaterialIcons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import {
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
import Embers from '../../../shared/components/common/Embers';
import Input from '../../../shared/components/common/Input';
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from '../../../shared/constants/theme';

const SERIF_FONT = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values) => handleLogin(values);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Embers />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {/* Encabezado e identidad visual (templo carmesí, como la web) */}
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <MaterialIcons name="account-balance" size={48} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Banco ICE</Text>
              <Text style={styles.subtitle}>HINOKAMI PORTAL</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                rules={{ required: 'Ingresa tu correo o usuario.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Correo o usuario"
                    placeholder="usuario@bancoice.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    inputStyle={styles.underlineInput}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                rules={{ required: 'Ingresa tu contraseña.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Contraseña"
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    autoCapitalize="none"
                    inputStyle={styles.underlineInput}
                  />
                )}
              />

              {error ? <Text style={styles.apiError}>{error}</Text> : null}

              <Button
                title="Iniciar sesión"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={styles.submit}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>¿NO TIENES CUENTA? </Text>
                <Pressable onPress={() => navigation.navigate('Register')} disabled={loading}>
                  <Text style={styles.footerLink}>REGISTRARSE</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Detalle inferior: 3 puntos como en la web */}
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBox: {
    padding: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: SERIF_FONT,
    fontSize: FONT_SIZE.xxl + 4,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: SPACING.sm,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 5,
    color: COLORS.secondary,
  },
  form: {
    padding: SPACING.lg,
  },
  underlineInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    paddingHorizontal: 0,
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
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    opacity: 0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
});
