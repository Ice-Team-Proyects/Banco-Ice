import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore.js';

export const LoginForm = ({ onForgot }) => {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const loading  = useAuthStore((s) => s.loading);
  const error    = useAuthStore((s) => s.error);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      
      if (res && res.success) {
        toast.success('¡Bienvenido al Sistema Bancario ICE!', { duration: 2500 });
        
        // 👇 TODOS VAN AL DASHBOARD. El menú ocultará las cosas prohibidas 👇
        navigate('/dashboard'); 
      }
    } catch (err) {
      console.error("Error en el componente de login:", err);
    }
  };

  const inputBase = (hasErr) =>
    `w-full h-[46px] pl-10 text-sm border rounded-xl bg-[#f8fafd] text-[#0a1628]
     outline-none transition-all duration-200
     focus:border-[#00AEEF] focus:bg-white focus:ring-2 focus:ring-[#00AEEF]/20
     ${hasErr ? 'border-red-400 bg-white' : 'border-[#e2e8f0]'}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* Correo electrónico */}
      <div>
        <label htmlFor="emailOrUsername"
          className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-2">
          Correo electrónico
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id="emailOrUsername"
            type="email"
            placeholder="usuario@bancoice.com"
            autoComplete="email"
            className={`${inputBase(errors.emailOrUsername)} pr-4`}
            {...register('emailOrUsername', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo válido',
              },
            })}
          />
        </div>
        {errors.emailOrUsername && <FieldError msg={errors.emailOrUsername.message} />}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password"
          className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-2">
          Contraseña
        </label>
        <div className="relative">
          <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className={`${inputBase(errors.password)} pr-10`}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
          <button
            type="button" tabIndex={-1}
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003A8F] transition-colors"
          >
            {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <FieldError msg={errors.password.message} />}
        <button type="button" onClick={onForgot}
          className="text-xs text-[#00AEEF] hover:text-[#003A8F] hover:underline transition-colors block text-right mt-1.5 w-full">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Error API */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 text-sm text-red-700 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
          {error}
        </div>
      )}

      {/* Botón */}
      <button type="submit" disabled={loading}
        className="w-full h-[48px] bg-[#003A8F] hover:bg-[#00AEEF] active:scale-[0.98]
          disabled:bg-[#b0bfd9] disabled:cursor-not-allowed
          text-white font-semibold text-sm rounded-xl mt-1
          transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,174,239,0.35)]">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Verificando...
          </span>
        ) : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

const FieldError = ({ msg }) => (
  <p className="flex items-center gap-1 text-red-600 text-xs mt-1.5">
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
    {msg}
  </p>
);