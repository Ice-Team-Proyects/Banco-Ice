import { create } from 'zustand';
import {
  getAccounts as getAccountsRequest,
  createAccount as createAccountRequest,
  doDeposit, doTransfer, doPayment, doWithdrawal,
} from '../../../shared/api';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const useAccountsStore = create((set, get) => ({
  accounts: [],
  loading: false,
  error: null,

  fetchAccounts: async () => {
    try {
      set({ loading: true, error: null });
      const res = await getAccountsRequest();
      const data = res.data?.data ?? res.data ?? [];
      set({ accounts: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al obtener las cuentas';
      set({ error: msg, loading: false });
      showError(msg);
    }
  },

  createAccount: async (payload) => {
    try {
      set({ loading: true, error: null });
      const res = await createAccountRequest(payload);
      const newAcc = res.data?.account ?? res.data?.data ?? res.data;
      set({ accounts: [newAcc, ...get().accounts], loading: false });
      showSuccess('Cuenta creada correctamente');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear la cuenta';
      set({ error: msg, loading: false });
      showError(msg);
      return false;
    }
  },

  deposit: async (payload) => {
    try {
      set({ loading: true, error: null });
      await doDeposit(payload);
      showSuccess('Depósito realizado correctamente');
      await get().fetchAccounts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al realizar el depósito';
      set({ error: msg, loading: false });
      showError(msg);
      return false;
    }
  },

  transfer: async (payload) => {
    try {
      set({ loading: true, error: null });
      await doTransfer(payload);
      showSuccess('Transferencia realizada correctamente');
      await get().fetchAccounts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al realizar la transferencia';
      set({ error: msg, loading: false });
      showError(msg);
      return false;
    }
  },

  withdrawal: async (payload) => {
    try {
      set({ loading: true, error: null });
      await doWithdrawal(payload);
      showSuccess('Retiro realizado correctamente');
      await get().fetchAccounts();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al realizar el retiro';
      set({ error: msg, loading: false });
      showError(msg);
      return false;
    }
  },
}));
