import { useForm } from 'react-hook-form';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { forgotPassword } from '../../../shared/api/auth.js';

export const ForgotPassword = ({ onSwitch }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      setLoading(true);
      await forgotPassword(email);
      setSent(true);
    } catch {
      setSent(true); // No revelar si el email existe o no (seguridad)
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-5">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
          <p className="font-semibold mb-1">Correo enviado</p>
          <p className="text-xs text-green-600">
            Si el correo existe en nuestro sistema, recibirás las instrucciones en breve.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitch}
          className="w-full text-sm text-[#003A8F] hover:text-[#00AEEF] hover:underline transition-colors"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="recover-email" className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-2">
          Correo electrónico
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id="recover-email"
            type="email"
            placeholder="usuario@bancoice.com"
            className={`w-full h-[46px] pl-10 pr-4 text-sm border rounded-xl bg-[#f8fafd] text-[#0a1628] transition-all duration-200 outline-none
              focus:border-[#00AEEF] focus:bg-white focus:ring-2 focus:ring-[#00AEEF]/20
              ${errors.email ? 'border-red-400 bg-white' : 'border-[#e2e8f0]'}`}
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-red-600 text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-[46px] bg-[#003A8F] hover:bg-[#00AEEF] active:scale-[0.98]
          disabled:bg-[#b0bfd9] disabled:cursor-not-allowed text-white font-semibold text-sm
          rounded-xl transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,174,239,0.35)]"
      >
        {loading ? 'Enviando...' : 'Enviar instrucciones'}
      </button>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full text-sm text-[#6b7a99] hover:text-[#003A8F] transition-colors"
      >
        ← Volver al inicio de sesión
      </button>
    </form>
  );
};
