import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
  baseURL: '/api/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

const axiosAdmin = axios.create({
  baseURL: '/banking/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

const attachToken = (config) => {
  let token = useAuthStore.getState().token;
  if (!token) {
    try {
      const storage = JSON.parse(localStorage.getItem('auth-banco-ice-v1'));
      token = storage?.state?.token;
    } catch {}
  }
  console.log('TOKEN ENVIADO:', typeof token, token?.substring(0, 30));
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

axiosAuth.interceptors.request.use(attachToken);
axiosAdmin.interceptors.request.use((config) => {
  config._axiosClient = 'admin';
  return attachToken(config);
});

// Refresh token interceptor
let _isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  failedQueue = [];
};

const handleRefresh = async (error) => {
  const original = error.config;
  if (!original || original._retry || error.response?.status !== 401)
    return Promise.reject(error);

  if (_isRefreshing) {
    return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
      .then((token) => {
        original.headers.Authorization = 'Bearer ' + token;
        return (original._axiosClient === 'admin' ? axiosAdmin : axiosAuth)(original);
      })
      .catch(Promise.reject);
  }

  original._retry = true;
  _isRefreshing = true;

  let refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    try {
      const s = JSON.parse(localStorage.getItem('auth-banco-ice-v1'));
      refreshToken = s?.state?.refreshToken;
    } catch {}
  }

  if (!refreshToken) {
    useAuthStore.getState().logout();
    return Promise.reject(error);
  }

  try {
    const res = await axiosAuth.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRt, userDetails } = res.data;
    useAuthStore.setState({
      token: accessToken,
      refreshToken: newRt,
      user: userDetails || useAuthStore.getState().user,
      isAuthenticated: true,
    });
    processQueue(null, accessToken);
    original.headers.Authorization = 'Bearer ' + accessToken;
    return (original._axiosClient === 'admin' ? axiosAdmin : axiosAuth)(original);
  } catch (err) {
    processQueue(err, null);
    useAuthStore.getState().logout();
    return Promise.reject(err);
  } finally {
    _isRefreshing = false;
  }
};

axiosAuth.interceptors.response.use((r) => r, handleRefresh);
axiosAdmin.interceptors.response.use((r) => r, handleRefresh);

export { axiosAdmin, axiosAuth };
