import { axiosAdmin } from '../../../shared/api/api';

export const transactionApi = {
  getTransactions: async (params = {}) => {
    const res = await axiosAdmin.get('/transactions', { params });
    return {
      transactions: res.data?.data ?? res.data ?? [],
      pagination: res.data?.pagination ?? { total: 0, totalPages: 1 },
    };
  },

  revertTransaction: async (id) => {
    const res = await axiosAdmin.patch(`/transactions/${id}/status`, { status: 'REVERSED' });
    return res.data?.data ?? res.data;
  },

  createTransaction: async (data) => {
    const res = await axiosAdmin.post('/transactions', data);
    return res.data?.data ?? res.data;
  },
};
