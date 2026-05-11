import React, { useEffect } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { useTransactions } from "../hooks/useTransactions";

export const UserTransactions = () => {
  const { transactions, isLoading, error, loadUserHistory } = useTransactions();

  useEffect(() => {
    // IMPORTANTE: En un escenario real, este ID provendrá de tu contexto global
    // de autenticación (ej. un AuthContext que guarda el payload del token JWT).
    // Por ahora, para probar que renderiza, puedes poner un ID estático temporal.
    const currentUserId = "AQUI_VA_EL_ID_DEL_USUARIO";
    loadUserHistory(currentUserId);
  }, [loadUserHistory]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Cargando tus movimientos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 text-red-700 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Movimientos</h2>
        <p className="text-sm text-gray-500">
          Consulta el historial de tus depósitos, retiros y transferencias.
        </p>
      </div>

      {/* Pasamos isAdmin como falso */}
      <TransactionTable transactions={transactions} isAdmin={false} />
    </div>
  );
};
