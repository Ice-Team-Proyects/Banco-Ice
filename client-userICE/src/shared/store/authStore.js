// client-userICE/src/shared/store/authStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const ACCESS_TOKEN_KEY = 'bancoice.access-token';
const REFRESH_TOKEN_KEY = 'bancoice.refresh-token';

async function secureSet(key, value) {
  try {
    if (value) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.warn(`No se pudo escribir "${key}" en SecureStore:`, error);
  }
}

/** Lee el refresh token guardado en SecureStore (no se mantiene en memoria). */
export async function getRefreshToken() {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    // Sin acceso al almacenamiento seguro: tratar como sesión sin refresh token.
    return null;
  }
}

/** Guarda (o elimina, si es null) el refresh token rotado por el backend. */
export async function saveRefreshToken(refreshToken) {
  await secureSet(REFRESH_TOKEN_KEY, refreshToken ?? null);
}

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      /** Inicia sesión: persiste los tokens en SecureStore y el usuario en el estado. */
      login: async (accessToken, user, refreshToken = null) => {
        await secureSet(ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
          await secureSet(REFRESH_TOKEN_KEY, refreshToken);
        }
        set({ token: accessToken, user, isAuthenticated: true });
      },

      /** Actualiza solo el access token (p. ej. tras un refresh). */
      setAccessToken: async (accessToken) => {
        await secureSet(ACCESS_TOKEN_KEY, accessToken ?? null);
        set({ token: accessToken ?? null });
      },

      /** Mezcla cambios parciales en el usuario actual. */
      updateUser: (changes) =>
        set((state) => ({ user: state.user ? { ...state.user, ...changes } : changes })),

      /** Cierra sesión: limpia SecureStore, el estado y lo persistido. */
      logout: async () => {
        await secureSet(ACCESS_TOKEN_KEY, null);
        await secureSet(REFRESH_TOKEN_KEY, null);
        set({ token: null, user: null, isAuthenticated: false });
      },

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'bancoice-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Los tokens nunca se persisten en AsyncStorage; viven en SecureStore.
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => async (state, error) => {
        try {
          const token = error ? null : await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
          if (token && state?.isAuthenticated) {
            useAuthStore.setState({ token, _hasHydrated: true });
          } else {
            // Sin token válido no hay sesión: limpiar estado inconsistente.
            useAuthStore.setState({
              token: null,
              user: null,
              isAuthenticated: false,
              _hasHydrated: true,
            });
          }
        } catch {
          useAuthStore.setState({
            token: null,
            user: null,
            isAuthenticated: false,
            _hasHydrated: true,
          });
        }
      },
    }
  )
);
