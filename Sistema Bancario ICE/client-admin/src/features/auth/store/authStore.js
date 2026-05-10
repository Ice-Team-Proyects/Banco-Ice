import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, register as registerRequest } from '../../../shared/api';
import { showError } from '../../../shared/utils/toast.js';
//import { authApi } from '../services/auth.api.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      refreshToken:    null,
      expiresAt:       null,
      loading:         false,
      error:           null,
      isLoadingAuth:   true,
      isAuthenticated: false,  

      checkAuth: () => {
        const token = get().token;
        const role  = get().user?.role;
        const isAdmin = role === 'ADMIN_ROLE';

        if (token && !isAdmin) {
          set({
            user:            null,
            token:           null,
            refreshToken:    null,
            isAuthenticated: false,  // ✅ Fix: typo
            isLoadingAuth:   false,
            error: 'No tiene permisos para acceder a esta aplicación',
          });
          return;
        }
        set({
          isLoadingAuth:   false,
          isAuthenticated: Boolean(token) && isAdmin,  // ✅ Fix: typo
        });
      },

      logout: () => {
        set({
          user:            null,
          token:           null,
          refreshToken:    null,
          expiresAt:       null,
          isAuthenticated: false,  
          error:           null,
        });
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ emailOrUsername, password });

          const role = data?.userDetails?.role;  

          if (role !== 'ADMIN_ROLE') {
            const message = 'No tienes permisos para acceder a esta aplicación';
            set({
              user:            null,
              token:           null,
              refreshToken:    null,
              expiresAt:       null,
              isAuthenticated: false,
              isLoadingAuth:   false,
              loading:         false,  // ✅ Fix: loading nunca se reseteaba en este bloque
              error:           message,
            });
            showError(message);
            return { success: false, error: message };
          }

          set({
            user:            data.userDetails,
            token:           data.accessToken,
            refreshToken:    data.refreshToken,
            expiresAt:       data.expiresIn,
            isAuthenticated: true,  // ✅ Fix: typo
            loading:         false, // ✅ Fix: loading nunca se reseteaba en éxito
            error:           null,
          });
          return { success: true };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.errors?.[0] ||
            'Error al iniciar sesión';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const { data } = await registerRequest(formData);
          set({ loading: false });
          return {
            success: true,
            emailVerificationRequired: data?.emailVerificationRequired,
            data,
          };
        } catch (err) {
          const message =
            err.response?.data?.message || 'Error al registrar usuario';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    { name: 'auth-banco-ice-v1' }
  )
);
