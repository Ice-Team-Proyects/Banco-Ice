import { useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import logo from '../../../assets/banco-ice-logo.svg';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleFinish = useCallback((success) => {
    const delay = success ? 2000 : 4000;
    setTimeout(() => navigate('/'), delay);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const displayMessage = status === 'loading' ? 'Verificando correo, por favor espera...' : message;

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-100 px-4'>
      <img src={logo} alt='Kinal Sports' className='w-28 h-28 object-contain mb-4' />

      <p className='text-lg font-semibold text-gray-700 text-center max-w-lg' aria-live='polite'>
        {displayMessage}
      </p>
      {status !== 'loading' && (
        <button
          onClick={() => navigate('/')}
          className='mt-6 px-5 py-2 rounded-lg border border-[#003A8F] text-[#003A8F] hover:bg-[#003A8F] hover:text-white transition'
        >
          Volver al login
        </button>
      )}
    </div>
  );
};