import { NavLink, useNavigate } from 'react-router-dom';
import {
  BanknotesIcon,
  ArrowsRightLeftIcon,
  BuildingLibraryIcon,
  UsersIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import toast from 'react-hot-toast';

// 👇 1. Agregamos un arreglo de 'roles' permitidos a cada botón 👇
const navItems = [
  { to: '/dashboard/accounts',     label: 'Cuentas',       Icon: BanknotesIcon,       roles: ['ADMIN_ROLE', 'USER_ROLE'] },
  { to: '/dashboard/transactions', label: 'Transacciones', Icon: ArrowsRightLeftIcon, roles: ['ADMIN_ROLE', 'USER_ROLE'] },
  { to: '/dashboard/services',     label: 'Servicios',     Icon: BuildingLibraryIcon, roles: ['ADMIN_ROLE', 'USER_ROLE'] },
  { to: '/dashboard/users',        label: 'Usuarios',      Icon: UsersIcon,           roles: ['ADMIN_ROLE'] }, // ¡Solo Admin!
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user   = useAuthStore((state) => state.user); // Extraemos al usuario
  const navigate = useNavigate();

  // Si por alguna razón no hay rol, asumimos que es un usuario normal por seguridad
  const userRole = user?.role || 'USER_ROLE'; 

  // 👇 2. Filtramos la lista: Solo dejamos los botones donde el rol del usuario esté permitido 👇
  const visibleNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-[#8b0000] via-[#6b0000] to-[#3b0000] flex flex-col shrink-0 min-h-screen text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-11 h-11 bg-[#FDF5E6] rounded-2xl flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#8b0000" strokeWidth="2.5" strokeLinecap="round">
            <rect x="3" y="10" width="18" height="11" rx="1"/>
            <path d="M12 2L3 8h18L12 2z"/>
            <line x1="8" y1="14" x2="8" y2="18"/>
            <line x1="12" y1="14" x2="12" y2="18"/>
            <line x1="16" y1="14" x2="16" y2="18"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Banco ICE</p>
          <p className="text-white/60 text-[10px] tracking-widest uppercase">{userRole === 'ADMIN_ROLE' ? 'Admin Panel' : 'Portal Cliente'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest px-3 mb-3">Menú Principal</p>

        {visibleNavItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white transition-all"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5 shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};