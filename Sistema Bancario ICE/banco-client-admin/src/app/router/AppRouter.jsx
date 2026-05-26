import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage }        from '../../features/auth/pages/AuthPage.jsx';
import { RegisterPage }    from '../../features/auth/pages/RegisterPage.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { ProtecterRoute }  from './ProtectedRoute.jsx';
import { RoleGuard }       from './RoleGuard.jsx';
import { DashboardPage }   from '../layouts/DashboardPage.jsx';
import { Users }           from '../../features/users/components/Users.jsx';
import { AdminTransactions } from '../../features/transactions/views/AdminTransactions.jsx';
import { Accounts }        from '../../features/accounts/components/Accounts.jsx';
import { Services }        from '../../features/services/components/Services.jsx';

export const AppRouter = () => (
  <Routes>
    {/* RUTAS PÚBLICAS */}
    <Route path="/"             element={<AuthPage />} />
    <Route path="/register"     element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />

    {/* DASHBOARD UNIFICADO PARA AMBOS ROLES */}
    <Route
      path="/dashboard/*"
      element={
        <ProtecterRoute>
          {/* 👇 MAGIA AQUÍ: Dejamos entrar tanto a ADMIN como a USER 👇 */}
          <RoleGuard allowedRoles={['ADMIN_ROLE', 'USER_ROLE']}>
            <DashboardPage />
          </RoleGuard>
        </ProtecterRoute>
      }
    >
      {/* Si entran a /dashboard directo, los mandamos a 'accounts' que es una vista neutral */}
      <Route index element={<Navigate to="accounts" replace />} />
      
      <Route path="users"        element={<Users />} />
      <Route path="transactions" element={<AdminTransactions />} />
      <Route path="accounts"     element={<Accounts />} />
      <Route path="services"     element={<Services />} />
    </Route>

    {/* RUTAS NO ENCONTRADAS (CATCH-ALL) */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);