import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { Spinner } from '../../features/auth/components/Spinner.jsx';

export const ProtecterRoute = ({ children }) => {
  // ✅ Fix: lee 'isAuthenticated' (correcto) - el store tenía typo 'isAutheticated'
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingAuth   = useAuthStore((state) => state.isLoadingAuth);

  if (isLoadingAuth)   return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
};
