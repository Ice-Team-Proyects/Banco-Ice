import { useState, useEffect, useCallback } from "react";
import { transactionApi } from "../services/transaction.api";
import { showError, showSuccess } from "../../../shared/utils/toast";

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Cambiado para coincidir con el componente
  const [error, setError] = useState(null); // Agregado estado de error
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  // Definimos loadAllTransactions como un useCallback para evitar bucles infinitos
  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await transactionApi.getTransactions({
        page: pagination.page,
        ...filters,
      });

      // Validamos que result tenga la estructura esperada para no romper la tabla
      setTransactions(result.transactions || []);
      setPagination((prev) => ({
        ...prev,
        total: result.pagination?.total || 0,
        totalPages: result.pagination?.totalPages || 0,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || "Error al cargar transacciones";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, filters]);

  // Función para revertir con el nombre que espera el componente
  const revertTransaction = async (id) => {
    try {
      await transactionApi.revertTransaction(id);
      showSuccess("Transacción revertida con éxito");
      await loadAllTransactions(); // Recargamos
    } catch (err) {
      showError(err.response?.data?.message || "No se pudo revertir");
      throw err; // Re-lanzamos para que el catch del componente funcione
    }
  };

  const changePage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // RETORNO: Aquí es donde "mapeamos" los nombres internos con los que usa el componente
  return {
    transactions,
    isLoading,
    error,
    pagination,
    loadAllTransactions, // Ahora el componente lo encontrará
    revertTransaction,    // Ahora el componente lo encontrará
    changePage,
    updateFilters,
    handleRevert: revertTransaction // Por si otro componente usa el nombre viejo
  };
};