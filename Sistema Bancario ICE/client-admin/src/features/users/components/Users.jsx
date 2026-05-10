import { useEffect, useState } from 'react';
import { UsersIcon, PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { AvatarUser } from '../../../shared/components/ui/AvatarUser.jsx';
import { CreateUserModal } from './CreateUserModal.jsx';

const roleBadge = {
    ADMIN_ROLE: 'bg-[#003A8F]/10 text-[#003A8F]',
    BANKER_ROLE: 'bg-[#00AEEF]/10 text-[#007ab3]',
    USER_ROLE: 'bg-gray-100 text-gray-500',
};

export const Users = () => {
    const {
        users,
        loading,
        error,
        filters,
        getAllUsers,
        createUser,
        deleteUser,
        toggleUserStatus,
        setFilters,
        getFilteredUsers
    } = useUserManagementStore();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const filteredUsers = getFilteredUsers();

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#003A8F]/10 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-[#003A8F]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-[#0a1628]">Usuarios del Sistema</h1>
                        <p className="text-xs text-gray-400">
                            {filteredUsers.length} de {users.length} usuarios
                            {filters.search && ` (filtrados)`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <FunnelIcon className="w-4 h-4" />
                        Filtros
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#003A8F] text-white rounded-lg hover:bg-[#002a6b] transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Controles de búsqueda y filtros */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o usuario..."
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003A8F]/20 focus:border-[#003A8F]"
                        />
                    </div>
                </div>

                {showFilters && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select
                                value={filters.role}
                                onChange={(e) => setFilters({ role: e.target.value })}
                                className="px-3 py-1 border border-gray-200 rounded text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="ADMIN_ROLE">Administrador</option>
                                <option value="BANKER_ROLE">Banquero</option>
                                <option value="USER_ROLE">Usuario</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ status: e.target.value })}
                                className="px-3 py-1 border border-gray-200 rounded text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {loading && <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando usuarios...</div>}
                {error && <div className="flex items-center justify-center h-48 text-red-500 text-sm">{error}</div>}
                {!loading && !error && filteredUsers.length === 0 && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                        <UsersIcon className="w-10 h-10 text-gray-200" />
                        <p className="text-sm text-gray-400">No hay usuarios registrados</p>
                    </div>
                )}
                {!loading && !error && filteredUsers.length === 0 && users.length > 0 && (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-200" />
                        <p className="text-sm text-gray-400">No se encontraron usuarios con los filtros aplicados</p>
                        <button
                            onClick={() => setFilters({ search: '', role: '', status: '' })}
                            className="text-[#003A8F] hover:underline text-sm"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
                {!loading && users.length > 0 && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#f8fafd] border-b border-gray-100">
                                {['Usuario', 'Email', 'Rol', 'Verificado', 'Registrado', 'Acciones'].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id ?? u.userId} className="border-b border-gray-50 hover:bg-[#f8fafd] transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <AvatarUser user={u} />
                                            <span className="font-medium text-[#0a1628]">
                                                {u.firstName} {u.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] ?? roleBadge.USER_ROLE}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-medium ${u.isEmailVerified ? 'text-green-600' : 'text-amber-500'}`}>
                                            {u.isEmailVerified ? 'Sí' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-GT') : '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleUserStatus(u.id ?? u.userId)}
                                                className={`px-2 py-1 text-xs rounded ${
                                                    u.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                {u.isActive ? 'Activo' : 'Inactivo'}
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-blue-600">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(u.id ?? u.userId)}
                                                className="p-1 text-gray-400 hover:text-red-600"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={createUser}
                loading={loading}
                error={error}
            />
        </section>
    );
};
