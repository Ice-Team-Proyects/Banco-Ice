// client-userICE/src/features/profile/screens/ProfileScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Card } from '../../../shared/components/common/Common';
import Embers from '../../../shared/components/common/Embers';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';

const ROLE_LABELS = {
  ADMIN_ROLE: 'Administrador',
  USER_ROLE: 'Usuario',
};

/**
 * Perfil del usuario. El backend aún no expone un endpoint de perfil,
 * así que se muestra la información guardada en el authStore al iniciar sesión.
 */
export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Embers count={14} />
      <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.headerCard}>
        {user?.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <MaterialIcons name="person" size={40} color={COLORS.primary} />
          </View>
        )}
        <Text style={styles.username}>{user?.username || 'Usuario'}</Text>
        <Text style={styles.role}>{ROLE_LABELS[user?.role] || user?.role || 'Cliente'}</Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Información de la cuenta</Text>

        <Input label="Usuario" value={user?.username || '—'} editable={false} />
        {user?.email ? <Input label="Correo electrónico" value={user.email} editable={false} /> : null}
        <Input
          label="Rol"
          value={ROLE_LABELS[user?.role] || user?.role || '—'}
          editable={false}
        />
        <Input
          label="Identificador"
          value={user?.id || '—'}
          editable={false}
          containerStyle={styles.lastInput}
        />
      </Card>

        <Button title="Cerrar sesión" variant="secondary" onPress={confirmLogout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  username: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  role: {
    marginTop: 2,
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
  },
  infoCard: {
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  lastInput: {
    marginBottom: 0,
  },
});
