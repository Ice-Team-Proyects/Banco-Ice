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

const navItems = [
  { to: '/dashboard/accounts',     label: 'Cuentas',       Icon: BanknotesIcon },
  { to: '/dashboard/transactions', label: 'Transacciones', Icon: ArrowsRightLeftIcon },
  { to: '/dashboard/services',     label: 'Servicios',     Icon: BuildingLibraryIcon },
  { to: '/dashboard/users',        label: 'Usuarios',      Icon: UsersIcon },
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  return (
    <aside className="w-60 bg-[#003A8F] flex flex-col shrink-0 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-[#FFD200] rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#003A8F" strokeWidth="2.5" strokeLinecap="round">
            <rect x="3" y="10" width="18" height="11" rx="1"/>
            <path d="M12 2L3 8h18L12 2z"/>
            <line x1="8" y1="14" x2="8" y2="18"/>
            <line x1="12" y1="14" x2="12" y2="18"/>
            <line x1="16" y1="14" x2="16" y2="18"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Banco ICE</p>
          <p className="text-white/45 text-[10px] tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest px-3 mb-3">
          Menú Principal
        </p>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60
            hover:bg-white/10 hover:text-white transition-all"
        >
          <ArrowRightStartOnRectangleIcon className="w-4.5 h-4.5 shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
