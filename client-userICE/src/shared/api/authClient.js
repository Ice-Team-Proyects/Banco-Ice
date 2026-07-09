// client-userICE/src/shared/api/authClient.js
import axios from 'axios';

import { ENDPOINTS } from '../constants/endpoints';
import { getRefreshToken, saveRefreshToken, useAuthStore } from '../store/authStore';

// Rutas de autenticación donde un 401 significa "credenciales inválidas",
// no "token vencido": nunca intentar refrescar en ellas.
const NO_REFRESH_PATHS = ['/login', '/register', '/verify-email'];

// Estado compartido del refresco entre TODOS los clientes (auth y banking):
// solo un refresh en vuelo; las peticiones concurrentes con 401 se encolan
// y se reintentan cuando llega el nuevo token.
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  pendingQueue = [];
}

async function requestNewAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error('No hay refresh token almacenado.');
  }

  // axios "pelado" a propósito: el refresh no debe pasar por los interceptores.
  const { data } = await axios.post(
    `${ENDPOINTS.AUTH_LOGIN}/refresh`,
    { refreshToken },
    { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
  );

  const newAccessToken = data?.accessToken;
  if (!newAccessToken) {
    throw new Error('La respuesta de refresh no incluye accessToken.');
  }

  await saveRefreshToken(data?.refreshToken ?? refreshToken);
  await useAuthStore.getState().setAccessToken(newAccessToken);
  return newAccessToken;
}

/**
 * Agrega a un cliente axios el Bearer del authStore y el flujo de refresh:
 * 401 -> refrescar una sola vez (cola para peticiones concurrentes) -> reintentar;
 * si el refresh falla, se cierra la sesión (logout).
 */
export function attachAuthInterceptors(client, { skipRefreshPaths = [] } = {}) {
  client.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const url = originalRequest?.url || '';

      const shouldSkipRefresh =
        !originalRequest ||
        originalRequest._retry ||
        !useAuthStore.getState().token ||
        skipRefreshPaths.some((path) => url.includes(path));

      if (status !== 401 || shouldSkipRefresh) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Ya hay un refresh en curso: encolar y reintentar con el token nuevo.
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const token = await requestNewAccessToken();
        flushQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return client;
}

// Cliente de autenticación. Sin baseURL fija: login y registro viven en
// microservicios distintos, así que cada llamada usa su URL absoluta.
const authClient = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

attachAuthInterceptors(authClient, { skipRefreshPaths: NO_REFRESH_PATHS });

export const authApi = {
  /** POST login en el servicio de autenticación (5210). */
  login: (credentials) => authClient.post(`${ENDPOINTS.AUTH_LOGIN}/login`, credentials),

  /** POST registro (multipart: acepta foto de perfil) en el servicio de registro (5227). */
  register: (formData) =>
    authClient.post(`${ENDPOINTS.AUTH_REGISTER}/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** POST verificación de correo con el token recibido por email. */
  verifyEmail: (token) => authClient.post(`${ENDPOINTS.AUTH_REGISTER}/verify-email`, { token }),
};

export default authClient;
