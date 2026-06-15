import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Landmark, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore.js';

/**
 * Componente del Portal de Acceso de Banco ICE (Hinokami Portal).
 * Diseño premium con animaciones de fuego y arquitectura japonesa.
 * Integra la lógica de autenticación completa.
 */
export const BancoIceLoginForm = ({ onForgot }) => {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Hooks de navegación y autenticación
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  // Configuración de react-hook-form para validaciones
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  // Observa los valores del formulario
  const emailValue = watch('emailOrUsername');
  const passwordValue = watch('password');

  const handleFormError = (formErrors) => {
    const firstError = Object.values(formErrors)[0]?.message;
    if (firstError) {
      toast.error(firstError);
    }
  };

  /**
   * Manejador principal del envío del formulario.
   * Llama a la función de login del store de autenticación.
   */
  const onSubmit = async (data) => {
    try {
      // Ejecutar el login con los datos del formulario
      const res = await login(data);

      if (res && res.success) {
        // Mostrar notificación de bienvenida
        toast.success('¡Bienvenido al Sistema Bancario ICE!', { duration: 2500 });

        // Redirigir al dashboard
        navigate('/dashboard');
        return;
      }

      toast.error(res?.error || 'Error al iniciar sesión. Intenta nuevamente.');
    } catch (err) {
      console.error('Error en el componente de login:', err);
      toast.error('Error al iniciar sesión. Intenta nuevamente.');
    }
  };

  /**
   * Genera las partículas de brasas/fuego para la animación de fondo.
   * Cada partícula tiene propiedades aleatorias de tamaño, posición y velocidad.
   */
  const embers = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1.5, // Tamaño aleatorio
    left: Math.random() * 100, // Posición horizontal %
    delay: Math.random() * 6, // Retraso de animación
    duration: Math.random() * 4 + 4, // Duración de la subida
  }));

  return (
    <div className="min-h-screen w-full bg-[#131313] text-stone-100 flex items-center justify-center relative overflow-hidden font-sans antialiased px-4 sm:px-6 selection:bg-[#ff5625] selection:text-[#FDF5E6]">
      {/* ==================== FONDOS Y EFECTOS VISUALES ==================== */}

      {/* 1. Partículas de Brasas Ascendentes - Fondo Animado */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-particles">
        {embers.map((ember) => (
          <motion.div
            key={ember.id}
            className="absolute bottom-[-10px] bg-gradient-to-t from-[#ff5625] to-[#dac49b] rounded-full opacity-40 pointer-events-none filter blur-[1px]"
            style={{
              width: ember.size,
              height: ember.size,
              left: `${ember.left}%`,
            }}
            animate={{
              y: [0, -1000], // Sube verticalmente
              x: [0, Math.sin(ember.id) * 35], // Movimiento oscilante
              opacity: [0, 0.5, 0.8, 0.4, 0], // Parpadeo desvanecido
            }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* 2. Viñeta Radial Atmosférica - Efecto de Profundidad */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 30%, rgba(139, 0, 0, 0.2) 100%)',
        }}
      />

      {/* 3. Resplandor de Fondo Dinámico - Aura de Brasas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-r from-[#ff5625]/15 to-[#8b0000]/15 rounded-full blur-[110px] z-0 pointer-events-none animate-pulse" />

      {/* ==================== TARJETA PRINCIPAL DEL FORMULARIO ==================== */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[min(520px,100%)] sm:max-w-[560px] px-4 sm:px-6 md:px-8 my-6 sm:my-8"
        id="login-card-container"
      >
        {/* Contenedor Crema Marfil con Borde Izquierdo Carmesí */}
        <div className="bg-[#FDF5E6] rounded-[2rem] border-l-[3px] border-[#8b0000] shadow-[0_0_45px_rgba(255,86,37,0.22)] overflow-hidden relative">
          {/* ==================== ENCABEZADO E IDENTIDAD VISUAL ==================== */}

          <div className="pt-10 pb-8 px-6 sm:px-10 text-center border-b border-stone-800/10 relative">
            {/* Icono del Templo Zen */}
            <div className="flex justify-center mb-5">
              <div className="p-3 bg-gradient-to-b from-[#8b0000]/10 to-transparent rounded-2xl">
                <Landmark className="w-12 h-12 text-[#8b0000] stroke-[1.5]" />
              </div>
            </div>

            {/* Nombre del Banco - Tipografía Serif Elegante */}
            <h1 className="font-serif text-[32px] sm:text-[42px] font-bold text-[#131313] tracking-widest uppercase leading-none selection:bg-[#8b0000] selection:text-[#FDF5E6]">
              Banco ICE
            </h1>

            {/* Subtítulo - Portal Hinokami */}
            <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.3em] text-stone-500 font-semibold uppercase mt-3.5">
              Hinokami Portal
            </p>
          </div>

          {/* ==================== FORMULARIO DE AUTENTICACIÓN ==================== */}

          <form
            onSubmit={handleSubmit(onSubmit, handleFormError)}
            className="p-6 sm:p-8 space-y-8"
            noValidate
          >
            {/* ========== CAMPO DE CORREO ELECTRÓNICO ========== */}
            <div className="relative group">
              <label
                htmlFor="emailOrUsername"
                className="font-mono text-stone-500 text-[9px] sm:text-[10px] tracking-widest uppercase block select-none transition-colors group-focus-within:text-[#ff5625] font-bold"
              >
                Correo Electrónico
              </label>

              <div className="mt-1 relative">
                <input
                  id="emailOrUsername"
                  type="email"
                  placeholder="usuario@bancoice.com"
                  autoComplete="email"
                  className="w-full bg-transparent border-none border-b border-stone-800/20 py-2.5 text-stone-900 font-sans text-base sm:text-lg focus:outline-none focus:border-[#ff5625] transition-colors placeholder:text-stone-800/30 pb-3 rounded-none"
                  {...register('emailOrUsername', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingresa un correo válido',
                    },
                  })}
                />
              </div>

              {/* Mostrar error si existe */}
              {errors.emailOrUsername && (
                <p className="text-xs text-red-500 mt-1.5 font-semibold">
                  {errors.emailOrUsername.message}
                </p>
              )}
            </div>

            {/* ========== CAMPO DE CONTRASEÑA ========== */}
            <div className="relative group">
              <label
                htmlFor="password"
                className="font-mono text-stone-500 text-[9px] sm:text-[10px] tracking-widest uppercase block select-none transition-colors group-focus-within:text-[#ff5625] font-bold"
              >
                Contraseña
              </label>

              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent border-none border-b border-stone-800/20 py-2.5 text-stone-900 font-sans text-base sm:text-lg focus:outline-none focus:border-[#ff5625] transition-colors placeholder:text-stone-800/30 pr-10 pb-3 rounded-none"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'Mínimo 6 caracteres',
                    },
                  })}
                />

                {/* Botón para Alternar Visibilidad */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-stone-500 hover:text-[#ff5625] transition-colors p-1.5 rounded focus:outline-none"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 stroke-[1.75]" />
                  ) : (
                    <Eye className="w-5 h-5 stroke-[1.75]" />
                  )}
                </button>
              </div>

              {/* Mostrar error si existe */}
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ========== OPCIONES: RECORDARME Y OLVIDO DE CONTRASEÑA ========== */}
            <div className="flex items-center justify-between pt-1 select-none">
              {/* Checkbox Recordarme */}
              <label className="flex items-center space-x-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />

                  {/* Caja de Checkbox Personalizada */}
                  <div className="w-4.5 h-4.5 rounded border border-stone-800/30 bg-transparent transition-all peer-checked:bg-[#8b0000] peer-checked:border-[#8b0000] flex items-center justify-center group-hover:border-[#ff5625] p-0.5" />

                  {/* Ícono Check SVG */}
                  <svg
                    className="absolute w-3 h-3 text-[#FDF5E6] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span className="font-mono text-[10.5px] text-stone-500 tracking-wider font-semibold">
                  Recordarme
                </span>
              </label>

              {/* Enlace Olvido de Contraseña */}
              <button
                type="button"
                onClick={onForgot}
                className="font-mono text-[9px] sm:text-[10.5px] text-[#8b0000] tracking-wider hover:text-[#ff5625] transition-colors focus:outline-none border-b border-transparent hover:border-[#ff5625] font-semibold"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>

            {/* ========== BOTÓN DE ENVÍO CON GRADIENTE ========== */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8b0000] via-[#ff5625] to-[#dac49b] text-[#FDF5E6] font-mono text-sm sm:text-[13px] tracking-[0.2em] py-4 px-5 sm:px-6 rounded-full shadow-[0_6px_22px_rgba(255,86,37,0.32)] hover:shadow-[0_10px_28px_rgba(255,86,37,0.48)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {loading ? 'Autenticando...' : 'INICIAR SESIÓN'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              {/* ========== SECCIÓN DE REGISTRO ========== */}
              <div className="mt-5 text-center">
                <p className="font-mono text-[10px] text-stone-500 tracking-widest leading-relaxed">
                  ¿NO TIENES CUENTA?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-[#ff5625] hover:text-[#8b0000] transition-colors border-b border-transparent hover:border-[#8b0000] font-bold"
                  >
                    REGISTRARSE
                  </button>
                </p>
              </div>
            </div>
          </form>

          {/* Detalles Decorativos en Bordes */}
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-stone-900/5 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none" />
        </div>

        {/* Detalle Inferior - 3 Puntos Japoneses Animados */}
        <div className="mt-8 flex justify-center space-x-2.5 opacity-50">
          <div className="w-1.5 h-1.5 bg-[#ff5625] rounded-full animate-bounce delay-75" />
          <div className="w-1.5 h-1.5 bg-[#ff5625] rounded-full animate-bounce delay-150" />
          <div className="w-1.5 h-1.5 bg-[#ff5625] rounded-full animate-bounce delay-300" />
        </div>
      </motion.div>
    </div>
  );
};

export default BancoIceLoginForm;
