import { useState } from 'react';
import { BancoIceLoginForm } from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#131313]">
      {/* Mostrar el nuevo componente de login con diseño Banco ICE */}
      {!isForgot ? (
        <BancoIceLoginForm onForgot={() => setIsForgot(true)} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <ForgotPassword onSwitch={() => setIsForgot(false)} />
        </div>
      )}
    </div>
  );
};
