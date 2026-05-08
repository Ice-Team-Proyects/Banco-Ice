// admin.js (el archivo que me pasaste antes)
import { axiosAuth } from './api.js';

// ❌ Antes: axiosAuth.get('/auth/users'); -> resultaba en /api/v1/auth/users
// ✅ Ahora: axiosAuth.get('/users');      -> resultará en /api/v1/users

export const getAllUsers   = ()     => axiosAuth.get('/users'); 
export const createUser    = (data) => axiosAuth.post('/users', data);
export const updateUser    = (id, d) => axiosAuth.put(`/users/${id}`, d);
export const deleteUser    = (id)    => axiosAuth.delete(`/users/${id}`);
export const toggleStatus  = (id)    => axiosAuth.patch(`/users/${id}/toggle-status`);