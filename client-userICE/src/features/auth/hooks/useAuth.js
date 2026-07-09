// client-userICE/src/features/auth/hooks/useAuth.js
import { useCallback, useState } from 'react';

import { authApi } from '../../../shared/api/authClient';
import { useAuthStore } from '../../../shared/store/authStore';

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Ocurrió un error inesperado. Inténtalo de nuevo.'
  );
}

/**
 * Lógica de autenticación para las pantallas de Login y Register.
 * Expone { handleLogin, handleRegister, loading, error, logout }.
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loginToStore = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  /** POST /login. El backend acepta correo o usuario en `emailOrUsername`. */
  const handleLogin = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await authApi.login({ emailOrUsername: email, password });
        // Respuesta: { success, message, token, userDetails, expiresAt }
        await loginToStore(data.token, data.userDetails, data.refreshToken ?? null);
        return { success: true };
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [loginToStore]
  );

  /** POST /register (multipart/form-data: el backend acepta foto de perfil opcional). */
  const handleRegister = useCallback(async ({ name, surname, username, email, password, phone }) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);

      const { data } = await authApi.register(formData);
      // Respuesta: { success, user, message, emailVerificationRequired }
      return { success: true, message: data?.message, data };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleLogin, handleRegister, loading, error, logout };
}
