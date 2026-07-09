// client-userICE/src/features/services/hooks/useServices.js
import { useCallback, useState } from 'react';

import bankingClient from '../../../shared/api/bankingClient';

const getErrorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

/** Servicios financieros del banco (catálogo usado por las operaciones). */
export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** GET /servicesbanking — lista los servicios bancarios. */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bankingClient.get('/servicesbanking');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setServices(list);
      return { success: true, data: list };
    } catch (err) {
      const message = getErrorMessage(err, 'Error al listar los servicios.');
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /** POST /servicesbanking — crea un servicio financiero. */
  const createService = useCallback(
    async ({ serviceName, serviceCode, serviceType, description, transactionFee, currency }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bankingClient.post('/servicesbanking', {
          serviceName,
          serviceCode,
          serviceType,
          description,
          transactionFee: transactionFee ? Number(transactionFee) : undefined,
          currency,
        });
        const data = response.data.data || response.data;
        return { success: true, data, message: response.data?.message };
      } catch (err) {
        const message = getErrorMessage(err, 'Error al crear el servicio.');
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { services, loading, error, fetchServices, createService };
}
