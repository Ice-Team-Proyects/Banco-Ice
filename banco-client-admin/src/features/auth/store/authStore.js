import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Asegúrate de agregar estas nuevas funciones exportadas en tu archivo shared/api.js
import { 
  login as loginRequest, 
  register as registerRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest
} from '../../../shared/api';
import { showError } from '../../../shared/utils/toast.js';

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

        if (!token) {
          set({
            user:            null,
            token:           null,
            refreshToken:    null,
            isAuthenticated: false,  
            isLoadingAuth:   false,
          });
          return;
        }
        set({
          isLoadingAuth:   false,
          isAuthenticated: true, 
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
          
          // 1. Hacemos la petición
          const { data } = await loginRequest({ emailOrUsername, password });  

          // 2. Guardamos el usuario (¡YA NO BLOQUEAMOS A LOS USUARIOS NORMALES!)
          set({
            user:            data.userDetails,
            token:           data.token,           
            refreshToken:    data.refreshToken ?? null,
            expiresAt:       data.expiresAt,        
            isAuthenticated: true,
            loading:         false,
            error:           null,
          });
          
          // 3. Retornamos el éxito y EL ROL para que el LoginForm sepa a dónde enviarlo
          return { success: true, role: data?.userDetails?.role };
          
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

      // 👇 FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA 👇

      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          // Llamamos a la API
          const { data } = await forgotPasswordRequest({ email });
          set({ loading: false });
          return { success: true, message: data.message };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al solicitar recuperación de contraseña';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          set({ loading: true, error: null });
          const { data } = await resetPasswordRequest({ token, newPassword });
          set({ loading: false });
          return { success: true, message: data.message };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al restablecer la contraseña';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      }

    }),
    { name: 'auth-banco-ice-v1' }
  )
);