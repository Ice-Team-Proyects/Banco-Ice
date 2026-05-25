import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { LoginForm }     from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';

const features = [
  'Pagos con QR',
  'Versión: 1.0'
];

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4">
      <div
        className="w-full max-w-[860px] grid md:grid-cols-2 min-h-[560px] rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,58,143,0.18), 0 4px 16px rgba(0,0,0,0.08)' }}
      >
        {/* ── PANEL IZQUIERDO ── */}
        <div className="relative bg-[#003A8F] p-10 hidden md:flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#00AEEF]/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-[#FFD200]/10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 bg-[#FFD200] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
                  stroke="#003A8F" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="10" width="18" height="11" rx="1"/>
                  <path d="M12 2L3 8h18L12 2z"/>
                  <line x1="8"  y1="14" x2="8"  y2="18"/>
                  <line x1="12" y1="14" x2="12" y2="18"/>
                  <line x1="16" y1="14" x2="16" y2="18"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Banco ICE
                </p>
                <p className="text-[10px] text-white/50 tracking-[2px] uppercase mt-0.5">
                  Sistema Bancario
                </p>
              </div>
            </div>

            <h1 className="text-[32px] font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'Georgia, serif' }}>
              Acceso{' '}
              <span className="text-[#FFD200]">seguro</span>
              <br />a tu portal
            </h1>
            <div className="w-10 h-[3px] bg-[#00AEEF] rounded-full mb-5" />
            <p className="text-sm text-white/60 leading-relaxed max-w-[240px]">
              Gestiona cuentas, transacciones y servicios bancarios desde un solo lugar.
            </p>
          </div>

          <ul className="relative z-10 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] shrink-0" />
                <span className="text-xs text-white/65">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div className="bg-white px-10 py-12 flex flex-col justify-center animate-fadeUp">
          {/* Logo móvil */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <div className="w-9 h-9 bg-[#003A8F] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                stroke="#FFD200" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="10" width="18" height="11" rx="1"/>
                <path d="M12 2L3 8h18L12 2z"/>
              </svg>
            </div>
            <p className="font-bold text-[#003A8F] text-base">Banco ICE</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0a1628] mb-1.5">
              {isForgot ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
            </h2>
            <p className="text-sm text-[#6b7a99]">
              {isForgot
                ? 'Ingresa tu correo para recibir instrucciones'
                : 'Ingresa tus credenciales para continuar'}
            </p>
          </div>

          {isForgot ? (
            <ForgotPassword onSwitch={() => setIsForgot(false)} />
          ) : (
            <LoginForm onForgot={() => setIsForgot(true)} />
          )}

          {/* ✅ Agregado: footer de seguridad que faltaba */}
          <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-gray-100">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-400">
              Conexión cifrada SSL · Banco ICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
