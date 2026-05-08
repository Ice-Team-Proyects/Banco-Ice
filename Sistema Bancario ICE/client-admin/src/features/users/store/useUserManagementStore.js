import { create } from 'zustand';
import {
    getAllUsers as getAllUsersRequest,
    createUser as createUserRequest,
    updateUser as updateUserRequest,
    deleteUser as deleteUserRequest,
    toggleStatus as toggleStatusRequest
} from '../../../shared/api';

export const useUserManagementStore = create((set, get) => ({
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    filters: {
        search: '',
        role: '',
        status: '',
    },

    setFilters: (newFilters) => {
        const state = get();
        const updatedFilters = { ...state.filters, ...newFilters };
        set({ filters: updatedFilters });

        // Aplicar filtros automáticamente
        const filtered = state.users.filter(user => {
            const matchesSearch = !updatedFilters.search ||
                `${user.firstName} ${user.lastName} ${user.email} ${user.username}`
                    .toLowerCase()
                    .includes(updatedFilters.search.toLowerCase());

            const matchesRole = !updatedFilters.role || user.role === updatedFilters.role;
            const matchesStatus = !updatedFilters.status ||
                (updatedFilters.status === 'active' ? user.isActive : !user.isActive);

            return matchesSearch && matchesRole && matchesStatus;
        });

        set({ filteredUsers: filtered });
    },

    getFilteredUsers: () => {
        const state = get();
        return state.filteredUsers.length > 0 ? state.filteredUsers : state.users;
    },

    setUsers: (users) => set({ users }),

    getAllUsers: async (apiFn = getAllUsersRequest, options = {}) => {
        try {
            const { force = false } = options;
            const state = get();

            if (state.loading) return;
            if (!force && state.users.length > 0) return;

            set({ loading: true, error: null });

            const fetcher = typeof apiFn === 'function' ? apiFn : getAllUsersRequest;

            const response = await fetcher();
            const usersData = response.users || response;
            set({
                users: usersData,
                filteredUsers: usersData, // Inicialmente mostrar todos
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al obtener los usuarios',
                loading: false,
            });
        }
    },

    createUser: async (userData) => {
        try {
            set({ loading: true, error: null });
            await createUserRequest(userData);
            // Recargar la lista de usuarios después de crear uno nuevo
            await get().getAllUsers(getAllUsersRequest, { force: true });
            set({ loading: false });
            return true;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al crear el usuario',
                loading: false,
            });
            return false;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            set({ loading: true, error: null });
            await updateUserRequest(userId, userData);
            // Recargar la lista de usuarios después de actualizar
            await get().getAllUsers(getAllUsersRequest, { force: true });
            set({ loading: false });
            return true;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al actualizar el usuario',
                loading: false,
            });
            return false;
        }
    },

    deleteUser: async (userId) => {
        try {
            set({ loading: true, error: null });
            await deleteUserRequest(userId);
            // Recargar la lista de usuarios después de eliminar
            await get().getAllUsers(getAllUsersRequest, { force: true });
            set({ loading: false });
            return true;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al eliminar el usuario',
                loading: false,
            });
            return false;
        }
    },

    toggleUserStatus: async (userId) => {
        try {
            set({ loading: true, error: null });
            await toggleStatusRequest(userId);
            // Recargar la lista de usuarios después de cambiar el estado
            await get().getAllUsers(getAllUsersRequest, { force: true });
            set({ loading: false });
            return true;
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al cambiar el estado del usuario',
                loading: false,
            });
            return false;
        }
    },
}));