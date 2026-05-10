import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Usa la variable del .env
});

// LOGIN (POST) - Ruta: /auth/login
export const login = (credentials) => api.post('/auth/login', credentials);

// LISTAR (GET) - Ruta: /auth/users
export const getUsers = () => api.get('/auth/users');