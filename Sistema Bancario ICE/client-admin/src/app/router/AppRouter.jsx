import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Features
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { RegisterPage } from '../../features/auth/pages/RegisterPage.jsx'; // Nueva
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';

// Router Guards
import { ProtecterRoute } from './ProtectedRoute.jsx'; 
import { RoleGuard } from './RoleGuard.jsx';

// Layouts & Other Features
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { Users } from '../../features/users/components/Users.jsx';

// Transaction Views
import { AdminTransactions } from '../../features/transactions/views/AdminTransactions.jsx';
import { UserTransactions } from '../../features/transactions/views/UserTransactions.jsx';

export const AppRouter = () => {
  return (
    <Routes>

      <Route path="/" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />


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
        <Route index element={<Navigate to="users" replace />} />
        
        <Route path="users" element={<Users />} />
        
        <Route path="transactions" element={<AdminTransactions />} />
        
        <Route path="accounts" element={<SectionStub title="Cuentas Bancarias" />} />
        <Route path="services" element={<SectionStub title="Servicios Bancarios" />} />
      </Route>


      <Route
        path="/mi-banca/*"
        element={
          <ProtecterRoute>
            <RoleGuard allowedRoles={['CLIENT_ROLE']}> 

              <Routes>
                <Route index element={<Navigate to="mis-movimientos" replace />} />
                <Route path="mis-movimientos" element={<UserTransactions />} />
              </Routes>
            </RoleGuard>
          </ProtecterRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


const SectionStub = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-3">
    <div className="w-12 h-12 bg-[#003A8F]/10 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-[#003A8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
    </div>
    <p className="text-lg font-semibold text-[#0a1628]">{title}</p>
    <p className="text-sm text-gray-400">Sección en desarrollo para: {title}</p>
  </div>
);