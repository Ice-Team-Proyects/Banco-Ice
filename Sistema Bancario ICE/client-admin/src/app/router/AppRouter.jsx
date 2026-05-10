import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage }        from '../../features/auth/pages/AuthPage.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { ProtecterRoute }  from './ProtecterRoute.jsx';
import { RoleGuard }       from './RoleGuard.jsx';
import { DashboardPage }   from '../layouts/DashboardPage.jsx';
import { Users }           from '../../features/users/components/Users.jsx';

// ✅ Fix: rutas de accounts/transactions/services que aparecen en el Sidebar
// ahora tienen componentes stub para no romper la navegación
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/"              element={<AuthPage />} />
      <Route path="/verify-email"  element={<VerifyEmailPage />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtecterRoute>
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <DashboardPage />
            </RoleGuard>
          </ProtecterRoute>
        }
      >
        {/* Redirige /dashboard a /dashboard/users por defecto */}
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users"        element={<Users />} />
        {/* Stubs para rutas del sidebar — expandir según el proyecto crezca */}
        <Route path="accounts"     element={<SectionStub title="Cuentas Bancarias" />} />
        <Route path="transactions" element={<SectionStub title="Transacciones" />} />
        <Route path="services"     element={<SectionStub title="Servicios Bancarios" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Placeholder limpio para secciones pendientes de implementar
const SectionStub = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-3">
    <div className="w-12 h-12 bg-[#003A8F]/10 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-[#003A8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
    </div>
    <p className="text-lg font-semibold text-[#0a1628]">{title}</p>
    <p className="text-sm text-gray-400">Sección en desarrollo</p>
  </div>
);
