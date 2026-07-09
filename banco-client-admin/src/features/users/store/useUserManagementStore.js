import { create } from 'zustand';
import { getUsersByRole, registerUser, updateUserRole } from '../../../shared/api';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

const ROLES_TO_FETCH = ['ADMIN_ROLE', 'USER_ROLE'];

const waitForToken = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      try {
        const raw = localStorage.getItem('auth-banco-ice-v1');
        if (!raw) return resolve(null);
        const token = JSON.parse(raw)?.state?.token;
        return resolve(token ?? null);
      } catch {
        return resolve(null);
      }
    }, 50);
  });

export const useUserManagementStore = create((set, get) => ({
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    filters: { search: '', role: '', status: '' },

    setFilters: (newFilters) => {
        const state = get();
        const updatedFilters = { ...state.filters, ...newFilters };
        set({ filters: updatedFilters });
        const filtered = state.users.filter((u) => {
            const fullName = `${u.name ?? ''} ${u.surname ?? ''} ${u.email ?? ''} ${u.username ?? ''}`.toLowerCase();
            const matchesSearch = !updatedFilters.search || fullName.includes(updatedFilters.search.toLowerCase());
            const matchesRole   = !updatedFilters.role   || u.role === updatedFilters.role;
            const matchesStatus = !updatedFilters.status ||
                (updatedFilters.status === 'active' ? u.status === true : u.status === false);
            return matchesSearch && matchesRole && matchesStatus;
        });
        set({ filteredUsers: filtered });
    },

    getFilteredUsers: () => {
        const state = get();
        const hasActiveFilter = state.filters.search || state.filters.role || state.filters.status;
        return hasActiveFilter ? state.filteredUsers : state.users;
    },

    getAllUsers: async (options = {}) => {
        const { force = false } = options;
        const state = get();
        if (state.loading && !force) return;
        if (!force && state.users.length > 0) return;

        set({ loading: true, error: null });

        await waitForToken();

        try {
            const results = await Promise.all(
                ROLES_TO_FETCH.map((role) => getUsersByRole(role))
            );
            const allUsers = results.flatMap((res) => {
                const data = res.data;
                return Array.isArray(data) ? data : [];
            });
            const seen = new Set();
            const unique = allUsers.filter((u) => {
                if (seen.has(u.id)) return false;
                seen.add(u.id);
                return true;
            });
            set({ users: unique, filteredUsers: unique, loading: false });
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al obtener los usuarios';
            set({ error: msg, loading: false });
            showError(msg);
        }
    },

    createUser: async (formData) => {
        try {
            set({ loading: true, error: null });
            await registerUser(formData);
            showSuccess('Usuario registrado correctamente. Debe verificar su email.');
            set({ users: [], filteredUsers: [] });
            await get().getAllUsers({ force: true });
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.title || 'Error al crear el usuario';
            set({ error: msg, loading: false });
            showError(msg);
            return false;
        }
    },

    changeUserRole: async (userId, newRole) => {
        try {
            set({ loading: true, error: null });
            await updateUserRole(userId, newRole);
            showSuccess('Rol actualizado correctamente');
            set({ users: [], filteredUsers: [] });
            await get().getAllUsers({ force: true });
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar el rol';
            set({ error: msg, loading: false });
            showError(msg);
            return false;
        }
    },
}));