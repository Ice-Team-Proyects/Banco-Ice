import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Landmark } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore.js';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((s) => s.loading);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Nombre requerido';
    if (!formData.surname) errors.surname = 'Apellido requerido';
    if (!formData.username) errors.username = 'Usuario requerido';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!formData.password || formData.password.length < 8) errors.password = 'Mínimo 8 caracteres';
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.phone || !/^\d{8}$/.test(formData.phone)) errors.phone = 'Teléfono debe tener 8 dígitos';

    setLocalErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await register(formData);

      if (result.success) {
        toast.success('Registro exitoso. Redirigiendo al login...', { duration: 2500 });
        setFormData({ name: '', surname: '', username: '', email: '', password: '', confirmPassword: '', phone: '' });
        setLocalErrors({});
        setTimeout(() => navigate('/'), 1200);
        return;
      }

      toast.error(result.error || 'No se pudo registrar el usuario.');
    } catch (error) {
      console.error('Error en el registro:', error);
      toast.error('Error al intentar registrar. Revisa los datos e intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#131313] text-stone-100 flex items-center justify-center relative overflow-hidden font-sans antialiased selection:bg-[#ff5625] selection:text-[#FDF5E6] py-10 px-4">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#131313] to-[#1c1c1c]"
          animate={{ opacity: [0.95, 1, 0.95] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="rounded-[2rem] border-l-[3px] border-[#8b0000] bg-[#FDF5E6] shadow-[0_0_45px_rgba(255,86,37,0.22)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-center gap-6 p-12 bg-[#8b0000] text-white">
              <div className="rounded-3xl bg-[#FDF5E6]/10 p-4 inline-flex">
                <Landmark className="w-12 h-12 text-[#FDF5E6] stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-4xl font-bold uppercase tracking-[0.2em] leading-tight">Banco ICE</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#FDF5E6]/80">
                  Crea tu cuenta en el portal con el mismo estilo sofisticado y seguro del inicio de sesión.
                </p>
              </div>
            </div>

            <div className="p-10 lg:p-12 relative">
              <h1 className="font-serif text-[38px] font-bold text-[#131313] uppercase tracking-[0.18em] leading-tight text-center lg:text-left">
                Registro ICE
              </h1>
              <p className="mt-3 text-center lg:text-left font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500">
                Hinokami Portal
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                      Nombre
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.name ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="surname" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                      Apellido
                    </label>
                    <input
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.surname ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                    Usuario
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.username ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                    placeholder="Nombre de usuario"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.email ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                    placeholder="usuario@bancoice.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.password ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                      Confirmar contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.confirmPassword ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="8"
                    className={`w-full mt-2 rounded-2xl border px-4 py-3 text-stone-900 text-sm bg-white transition ${localErrors.phone ? 'border-red-500' : 'border-stone-300 focus:border-[#ff5625]'}`}
                    placeholder="8 dígitos"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8b0000] via-[#ff5625] to-[#dac49b] py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#FDF5E6] shadow-[0_8px_28px_rgba(255,86,37,0.24)] transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>

                <div className="mt-6 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-stone-500">
                    ¿Ya tienes cuenta?
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mt-3 inline-flex items-center gap-2 text-[#8b0000] font-semibold hover:text-[#ff5625] transition"
                  >
                    ← Volver al login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};