import { axiosAdmin, axiosAuth } from './api.js';

// ── Usuarios (auth-service) ────────────────────────────────────────────────
// El servidor solo expone GET /users/by-role/:roleName y PUT /users/:userId/role
export const getUsersByRole  = (role)        => axiosAuth.get(`/users/by-role/${role}`);
export const updateUserRole  = (id, role)    => axiosAuth.put(`/users/${id}/role`, { roleName: role });
// El registro va a POST /auth/register (multipart/form-data)
export const registerUser    = (formData)    => axiosAuth.post('/auth/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// ── Cuentas (banking-service) ──────────────────────────────────────────────
export const getAccounts    = ()         => axiosAdmin.get('/accounts');
export const createAccount  = (data)     => axiosAdmin.post('/accounts', data);
export const getBalance     = (num)      => axiosAdmin.get(`/accounts/balance/${num}`);
export const doDeposit      = (data)     => axiosAdmin.post('/accounts/deposit', data);
export const doTransfer     = (data)     => axiosAdmin.post('/accounts/transfer', data);
export const doPayment      = (data)     => axiosAdmin.post('/accounts/payment', data);
export const doWithdrawal   = (data)     => axiosAdmin.post('/accounts/withdrawal', data);

// ── Transacciones (banking-service) ───────────────────────────────────────
export const getTransactions        = (params)        => axiosAdmin.get('/transactions', { params });
export const createTransaction      = (data)          => axiosAdmin.post('/transactions', data);
export const patchTransactionStatus = (id, status)    => axiosAdmin.patch(`/transactions/${id}/status`, { status });

// ── Servicios Bancarios (banking-service) ─────────────────────────────────
export const getServices   = ()      => axiosAdmin.get('/servicesbanking');
export const createService = (data)  => axiosAdmin.post('/servicesbanking', data);
