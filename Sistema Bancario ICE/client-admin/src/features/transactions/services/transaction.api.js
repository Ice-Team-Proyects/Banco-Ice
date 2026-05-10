import { axiosAdmin } from '../../../shared/api/api';

export const transactionApi = {
  getTransactions: async (params = {}) => {
    // Es vital que el interceptor en axiosAdmin esté funcionando para evitar el 401
    const response = await axiosAdmin.get('/transactions', { params });
    
    // Ajustado para manejar la estructura de respuesta de tu backend
    return {
      transactions: response.data?.data || [],
      pagination: response.data?.pagination || { total: 0, totalPages: 1 }
    };
  },

  revertTransaction: async (transactionId) => {
    // PATCH a /transactions/:id/status para revertir
    const response = await axiosAdmin.patch(`/transactions/${transactionId}/status`, {
      status: 'REVERSED'
    });
    return response.data?.data;
  },

  createTransaction: async (transactionData) => {
    const response = await axiosAdmin.post('/transactions', transactionData);
    return response.data?.data;
  }
};