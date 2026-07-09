// client-userICE/src/features/accounts/hooks/useAccounts.js
import { useCallback, useState } from 'react';

import bankingClient from '../../../shared/api/bankingClient';

const getErrorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

/** Cuentas bancarias: listado, creación y consulta de saldo. */
export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** GET /accounts — lista las cuentas del usuario autenticado. */
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bankingClient.get('/accounts');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setAccounts(list);
      return { success: true, data: list };
    } catch (err) {
      const message = getErrorMessage(err, 'Error al listar las cuentas.');
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /** POST /accounts — crea una cuenta { accountType, ownerName, ownerDPI, currency, dailyLimit }. */
  const createAccount = useCallback(
    async ({ accountType, ownerName, ownerDPI, currency, dailyLimit }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bankingClient.post('/accounts', {
          accountType,
          ownerName,
          ownerDPI,
          currency,
          dailyLimit: dailyLimit ? Number(dailyLimit) : undefined,
        });
        const data = response.data.data || response.data;
        return { success: true, data, message: response.data?.message };
      } catch (err) {
        const message = getErrorMessage(err, 'Error al crear la cuenta.');
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** GET /accounts/balance/:accountNumber — consulta el saldo de una cuenta. */
  const getBalance = useCallback(async (accountNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bankingClient.get(`/accounts/balance/${accountNumber}`);
      const data = response.data.data || response.data;
      return { success: true, data };
    } catch (err) {
      const message = getErrorMessage(err, 'Error al consultar el saldo.');
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { accounts, loading, error, fetchAccounts, createAccount, getBalance };
}
