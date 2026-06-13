import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register); 

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    phone: '' // ¡Recuerda: exactamente 8 dígitos!
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [localErrors, setLocalErrors] = useState({});
  const loading = useAuthStore((s) => s.loading);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setLocalErrors({});

    const errors = {};
    if (!formData.name) errors.name = 'Nombre requerido';
    if (!formData.surname) errors.surname = 'Apellido requerido';
    if (!formData.username) errors.username = 'Usuario requerido';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!formData.password || formData.password.length < 8) errors.password = 'Mínimo 8 caracteres';
    if (!formData.phone || !/^\d{8}$/.test(formData.phone)) errors.phone = 'Teléfono debe tener 8 dígitos';
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccessMessage('Registro exitoso. Redirigiendo al login...');
        setFormData({ name: '', surname: '', username: '', email: '', password: '', phone: '', confirmPassword: '' });
        setTimeout(() => navigate('/'), 1200);
        return;
      }
      setErrorMessage(result.error || 'No se pudo registrar el usuario.');
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrorMessage('Error al intentar registrar. Revisa los datos e intenta de nuevo.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-[#003A8F]">Registro ICE</h2>

        {/* Campos nuevos del DTO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input type="text" name="name" value={formData.name} placeholder="Nombre" onChange={handleChange} className="w-full border p-2 rounded" />
            {localErrors.name && <p className="text-xs text-red-500 mt-1">{localErrors.name}</p>}
          </div>
          <div>
            <input type="text" name="surname" value={formData.surname} placeholder="Apellido" onChange={handleChange} className="w-full border p-2 rounded" />
            {localErrors.surname && <p className="text-xs text-red-500 mt-1">{localErrors.surname}</p>}
          </div>
        </div>

        <input type="text" name="username" value={formData.username} placeholder="Nombre de Usuario" onChange={handleChange} className="border p-2 rounded" />
        <div>
          <input type="text" name="phone" value={formData.phone} placeholder="Teléfono (8 dígitos)" onChange={handleChange} maxLength="8" className="w-full border p-2 rounded" />
          {localErrors.phone && <p className="text-xs text-red-500 mt-1">{localErrors.phone}</p>}
        </div>

        {/* Campos clásicos */}
        <input type="email" name="email" value={formData.email} placeholder="Correo Electrónico" onChange={handleChange} className="border p-2 rounded" />
        {localErrors.email && <p className="text-xs text-red-500 mt-1">{localErrors.email}</p>}

        <input type="password" name="password" value={formData.password} placeholder="Contraseña" onChange={handleChange} minLength="8" className="border p-2 rounded" />
        {localErrors.password && <p className="text-xs text-red-500 mt-1">{localErrors.password}</p>}
        <input type="password" name="confirmPassword" value={formData.confirmPassword || ''} placeholder="Confirmar contraseña" onChange={handleChange} className="border p-2 rounded" />
        {localErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{localErrors.confirmPassword}</p>}

        {successMessage && (
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#003A8F] text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
              Registrando...
            </>
          ) : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
};