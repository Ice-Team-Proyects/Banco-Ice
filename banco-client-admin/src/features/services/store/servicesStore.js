import { create } from 'zustand';
import { getServices as getServicesRequest, createService as createServiceRequest } from '../../../shared/api';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const useServicesStore = create((set, get) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    try {
      set({ loading: true, error: null });
      const res = await getServicesRequest();
      const data = res.data?.data ?? res.data ?? [];
      set({ services: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al obtener los servicios';
      set({ error: msg, loading: false });
      showError(msg);
    }
  },

  createService: async (payload) => {
    try {
      set({ loading: true, error: null });
      const res = await createServiceRequest(payload);
      const newSvc = res.data?.service ?? res.data?.data ?? res.data;
      set({ services: [newSvc, ...get().services], loading: false });
      showSuccess('Servicio bancario creado correctamente');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear el servicio';
      set({ error: msg, loading: false });
      showError(msg);
      return false;
    }
  },
}));
