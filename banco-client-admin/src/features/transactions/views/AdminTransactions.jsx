import React, { useEffect, useCallback } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { useTransactions } from "../hooks/useTransactions";

export const AdminTransactions = () => {
  // Nota: Deberás asegurarte de que tu hook useTransactions tenga implementadas
  // las funciones loadAllTransactions y revertTransaction que definimos en el servicio.
  const {
    transactions,
    isLoading,
    error,
    loadAllTransactions,
    revertTransaction,
  } = useTransactions();

  useEffect(() => {
    loadAllTransactions();
  }, [loadAllTransactions]);

  const handleRevert = useCallback(
    async (transactionId) => {
      // Una buena práctica de UI: Confirmación antes de una acción destructiva/crítica
      if (
        window.confirm(
          "¿Estás absolutamente seguro de que deseas revertir esta transacción? Esta acción modificará los saldos.",
        )
      ) {
        try {
          await revertTransaction(transactionId);
          // Si la reversión es exitosa, volvemos a cargar la tabla para reflejar el estado 'REVERSED'
          loadAllTransactions();
        } catch (err) {
          alert("Hubo un problema al intentar revertir la transacción.");
        }
      }
    },
    [revertTransaction, loadAllTransactions],
  );

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Cargando auditoría global...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 text-red-700 bg-red-100 rounded-lg">
        Error de conexión: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Auditoría de Transacciones
          </h2>
          <p className="text-sm text-gray-500">
            Panel global de monitorización del sistema bancario.
          </p>
        </div>
        <button
          onClick={loadAllTransactions}
          className="text-sm px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          Actualizar Datos
        </button>
      </div>

      {/* Pasamos isAdmin como verdadero y le inyectamos la función de revertir */}
      <TransactionTable
        transactions={transactions}
        isAdmin={true}
        onRevert={handleRevert}
      />
    </div>
  );
};
