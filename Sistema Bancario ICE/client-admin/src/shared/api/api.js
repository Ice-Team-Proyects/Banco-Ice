import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- CORRECCIÓN 1: Interceptor Robusto ---
axiosAdmin.interceptors.request.use((config) => {
  config._axiosClient = 'admin';
  
  // Intentamos sacar el token de Zustand
  let token = useAuthStore.getState().token;

  // Si por alguna razón Zustand está vacío (hidratación lenta), 
  // lo sacamos directamente del motor de almacenamiento como plan B.
  if (!token) {
    const storage = JSON.parse(localStorage.getItem('auth-storage'));
    token = storage?.state?.token;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // LOG DE SEGURIDAD: Descomenta la línea de abajo para ver en consola si el token sale
    // console.log("Enviando token a Node:", token);
  }
  
  return config;
});

// Aplicamos lo mismo para Auth por consistencia
axiosAuth.interceptors.request.use((config) => {
  config._axiosClient = 'auth';
  let token = useAuthStore.getState().token;
  
  if (!token) {
    const storage = JSON.parse(localStorage.getItem('auth-storage'));
    token = storage?.state?.token;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (_error ? reject(_error) : resolve(token)));
  failedQueue = [];
}

const handleRefreshToken = async function (_error) {
  const _original = _error.config;
  if (!_original || _original._retry) {
    return Promise.reject(_error);
  }

  const status = _error.response?.status;
  // --- CORRECCIÓN 2: Coincidencia de errores ---
  // Node.js a veces no manda 'TOKEN_EXPIRED' como string, solo el 401.
  const shouldRefresh = status === 401;

  if (shouldRefresh) {
    const retryClient = _original._axiosClient === 'admin' ? axiosAdmin : axiosAuth;
    if (_isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          _original.headers['Authorization'] = 'Bearer ' + token;
          return retryClient(_original);
        })
        .catch((err) => Promise.reject(err));
    }

    _original._retry = true;
    _isRefreshing = true;

    // --- CORRECCIÓN 3: Plan B para Refresh Token ---
    let refreshToken = useAuthStore.getState().refreshToken;
    if(!refreshToken) {
        const storage = JSON.parse(localStorage.getItem('auth-storage'));
        refreshToken = storage?.state?.refreshToken;
    }

    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(_error);
    }

    try {
      // Usamos axiosAuth para el refresh
      const response = await axiosAuth.post('/auth/refresh', { refreshToken });
      
      // Ajuste según estructura de respuesta de C#
      const { accessToken, refreshToken: newRefreshToken, userDetails } = response.data;
      
      useAuthStore.setState({
        token: accessToken,
        refreshToken: newRefreshToken,
        user: userDetails || useAuthStore.getState().user,
        isAuthenticated: true,
      });

      _processQueue(null, accessToken);
      _original.headers['Authorization'] = 'Bearer ' + accessToken;
      return retryClient(_original);
    } catch (err) {
      _processQueue(err, null);
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      _isRefreshing = false;
    }
  }
  return Promise.reject(_error);
};

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);
axiosAdmin.interceptors.response.use((res) => res, handleRefreshToken);

export { handleRefreshToken };
export { axiosAdmin, axiosAuth };