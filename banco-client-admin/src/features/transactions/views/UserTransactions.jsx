import { useEffect } from 'react';
import { TransactionTable } from '../components/TransactionTable';
import { useTransactions } from '../hooks/useTransactions';
import { useAuthStore } from '../../auth/store/authStore.js';

export const UserTransactions = () => {
  const { transactions, isLoading, error, loadAllTransactions } = useTransactions();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadAllTransactions();
  }, [loadAllTransactions]);

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Cargando movimientos...</div>;
  if (error)     return <div className="p-4 m-4 text-red-700 bg-red-100 rounded-lg">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Movimientos</h2>
        <p className="text-sm text-gray-500">Historial de depósitos, retiros y transferencias.</p>
      </div>
      <TransactionTable transactions={transactions} isAdmin={false} />
    </div>
  );
};
