import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter.jsx';
import { useAuthStore } from '../features/auth/store/authStore.js';
import { UiConfirmHost } from '../features/auth/components/ConfirmModal.jsx';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isLoadingAuth = useAuthStore((s) => s.isLoadingAuth);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#003A8F] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD200" strokeWidth="3"/>
              <path className="opacity-75" fill="#FFD200" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
          </div>
          <p className="text-sm text-[#6b7a99]">Cargando Banco ICE...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UiConfirmHost />
      <AppRouter />
    </>
  );
}
