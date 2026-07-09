import { useEffect, useState } from 'react';
import {
    UsersIcon, PlusIcon, PencilIcon,
    MagnifyingGlassIcon, FunnelIcon, ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { CreateUserModal } from './CreateUserModal.jsx';

const roleBadge = {
    ADMIN_ROLE:  'bg-[#003A8F]/10 text-[#003A8F]',
    BANKER_ROLE: 'bg-[#00AEEF]/10 text-[#007ab3]',
    USER_ROLE:   'bg-gray-100 text-gray-500',
};
const roleLabel = {
    ADMIN_ROLE:  'Administrador',
    BANKER_ROLE: 'Banquero',
    USER_ROLE:   'Usuario',
};

// Mini modal para cambiar rol
const ChangeRoleModal = ({ user, onClose, onConfirm, loading }) => {
    const [newRole, setNewRole] = useState(user.role === 'ADMIN_ROLE' ? 'USER_ROLE' : 'ADMIN_ROLE');
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#003A8F]/10 rounded-xl flex items-center justify-center">
                        <ShieldCheckIcon className="w-5 h-5 text-[#003A8F]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#0a1628]">Cambiar Rol</h3>
                        <p className="text-xs text-gray-400">{user.name} {user.surname}</p>
                    </div>
                </div>
                <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-[#003A8F]/20"
                >
                    <option value="USER_ROLE">Usuario</option>
                    <option value="ADMIN_ROLE">Administrador</option>
                </select>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">Cancelar</button>
                    <button
                        onClick={() => onConfirm(user.id, newRole)}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                        style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}
                    >
                        {loading ? 'Guardando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Users = () => {
    const {
        users, loading, error, filters,
        getAllUsers, createUser, changeUserRole,
        setFilters, getFilteredUsers,
    } = useUserManagementStore();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters,     setShowFilters]     = useState(false);
    const [roleTarget,      setRoleTarget]      = useState(null); // usuario al que cambiarle rol

    const filteredUsers = getFilteredUsers();

    useEffect(() => { getAllUsers(); }, [getAllUsers]);

    const handleRoleConfirm = async (userId, newRole) => {
        const ok = await changeUserRole(userId, newRole);
        if (ok) setRoleTarget(null);
    };

    return (
        <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#003A8F]/10 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-[#003A8F]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-[#0a1628]">Usuarios del Sistema</h1>
                        <p className="text-xs text-gray-400">
                            {filteredUsers.length} de {users.length} usuarios
                            {filters.search && ' (filtrados)'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm transition ${showFilters ? 'border-[#003A8F] text-[#003A8F]' : 'border-gray-200 text-gray-600'}`}
                    >
                        <FunnelIcon className="w-4 h-4" /> Filtros
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#003A8F] text-white rounded-lg hover:bg-[#002a6b] transition text-sm"
                    >
                        <PlusIcon className="w-4 h-4" /> Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className="mb-5 space-y-3">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido, email o usuario..."
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#003A8F]/20 focus:border-[#003A8F]"
                    />
                </div>

                {showFilters && (
                    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rol</label>
                            <select
                                value={filters.role}
                                onChange={(e) => setFilters({ role: e.target.value })}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="ADMIN_ROLE">Administrador</option>
                                <option value="USER_ROLE">Usuario</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ status: e.target.value })}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ search: '', role: '', status: '' })}
                                className="px-3 py-1.5 text-xs text-[#003A8F] hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {loading && (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm animate-pulse">
                        Cargando usuarios...
                    </div>
                )}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                        <p className="text-sm text-red-500">{error}</p>
                        <button onClick={() => getAllUsers({ force: true })} className="text-xs text-[#003A8F] hover:underline">
                            Reintentar
                        </button>
                    </div>
                )}
                {!loading && !error && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                        <UsersIcon className="w-10 h-10 text-gray-200" />
                        <p className="text-sm text-gray-400">No hay usuarios registrados</p>
                    </div>
                )}
                {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-200" />
                        <p className="text-sm text-gray-400">Sin resultados para los filtros aplicados</p>
                        <button onClick={() => setFilters({ search: '', role: '', status: '' })} className="text-xs text-[#003A8F] hover:underline">
                            Limpiar filtros
                        </button>
                    </div>
                )}
                {!loading && !error && filteredUsers.length > 0 && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#f8fafd] border-b border-gray-100">
                                {['Usuario', 'Email', 'Teléfono', 'Rol', 'Estado', 'Email verificado', 'Registrado', 'Acciones'].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b border-gray-50 hover:bg-[#f8fafd] transition-colors">
                                    {/* Usuario */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            {u.profilePicture ? (
                                                <img src={u.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#003A8F]/10 flex items-center justify-center text-[#003A8F] text-xs font-bold">
                                                    {(u.name?.[0] ?? '?').toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-[#0a1628]">{u.name} {u.surname}</p>
                                                <p className="text-xs text-gray-400">@{u.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Email */}
                                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                                    {/* Teléfono */}
                                    <td className="px-5 py-3.5 text-gray-500">{u.phone || '—'}</td>
                                    {/* Rol */}
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] ?? roleBadge.USER_ROLE}`}>
                                            {roleLabel[u.role] ?? u.role}
                                        </span>
                                    </td>
                                    {/* Estado (C# → status: bool) */}
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-medium ${u.status ? 'text-green-600' : 'text-red-500'}`}>
                                            {u.status ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    {/* Email verificado */}
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-medium ${u.isEmailVerified ? 'text-green-600' : 'text-amber-500'}`}>
                                            {u.isEmailVerified ? 'Verificado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    {/* Fecha */}
                                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-GT') : '—'}
                                    </td>
                                    {/* Acciones */}
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => setRoleTarget(u)}
                                            title="Cambiar rol"
                                            className="p-1.5 rounded-lg bg-[#003A8F]/10 text-[#003A8F] hover:bg-[#003A8F]/20 transition"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modales */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={createUser}
                    loading={loading}
                />
            )}
            {roleTarget && (
                <ChangeRoleModal
                    user={roleTarget}
                    onClose={() => setRoleTarget(null)}
                    onConfirm={handleRoleConfirm}
                    loading={loading}
                />
            )}
        </section>
    );
};
