// client-userICE/src/features/transactions/hooks/useTransactions.js
import { useCallback, useState } from 'react';

import bankingClient from '../../../shared/api/bankingClient';

const getErrorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

/**
 * Operaciones bancarias. Todas requieren `fieldService` (ID del servicio bancario
 * asociado a la operación) además del monto y las cuentas involucradas.
 */
export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (path, payload, fallbackMessage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bankingClient.post(path, payload);
      const data = response.data.data || response.data;
      return { success: true, data, message: response.data?.message };
    } catch (err) {
      const message = getErrorMessage(err, fallbackMessage);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /** POST /accounts/deposit — { accountNumber, amount, fieldService, description? }. */
  const makeDeposit = useCallback(
    ({ accountNumber, amount, fieldService, description }) =>
      execute(
        '/accounts/deposit',
        { accountNumber, amount: Number(amount), fieldService, description },
        'Error al realizar el depósito.'
      ),
    [execute]
  );

  /** POST /accounts/withdrawal — { sourceAccountNumber, amount, fieldService, description? }. */
  const makeWithdrawal = useCallback(
    ({ sourceAccountNumber, amount, fieldService, description }) =>
      execute(
        '/accounts/withdrawal',
        { sourceAccountNumber, amount: Number(amount), fieldService, description },
        'Error al realizar el retiro.'
      ),
    [execute]
  );

  /** POST /accounts/transfer — agrega destinationAccountNumber. */
  const makeTransfer = useCallback(
    ({ sourceAccountNumber, destinationAccountNumber, amount, fieldService, description }) =>
      execute(
        '/accounts/transfer',
        {
          sourceAccountNumber,
          destinationAccountNumber,
          amount: Number(amount),
          fieldService,
          description,
        },
        'Error al realizar la transferencia.'
      ),
    [execute]
  );

  /** POST /accounts/payment — agrega externalReference (referencia del servicio a pagar). */
  const makePayment = useCallback(
    ({ sourceAccountNumber, amount, fieldService, externalReference, description }) =>
      execute(
        '/accounts/payment',
        {
          sourceAccountNumber,
          amount: Number(amount),
          fieldService,
          externalReference,
          description,
        },
        'Error al realizar el pago.'
      ),
    [execute]
  );

  return { makeDeposit, makeWithdrawal, makeTransfer, makePayment, loading, error };
}
