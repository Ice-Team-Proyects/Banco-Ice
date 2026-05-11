import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const navigate = useNavigate();
  // Zustand hook (asegúrate de tener la acción register en tu store)
  const register = useAuthStore((state) => state.register); 

  // 1. Ampliamos el estado para cumplir con el DTO
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    phone: '' // ¡Recuerda: exactamente 8 dígitos!
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación rápida en el frontend antes de enviar
    if (formData.phone.length !== 8) {
      alert("El número de teléfono debe tener exactamente 8 dígitos.");
      return;
    }

    try {
      // 2. Enviamos el objeto completo a tu API
      await register(formData);
      
      // Si el registro es exitoso, enviamos al usuario al login
      navigate('/'); 
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-[#003A8F]">Registro ICE</h2>

        {/* Campos nuevos del DTO */}
        <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="surname" placeholder="Apellido" onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="username" placeholder="Nombre de Usuario" onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="phone" placeholder="Teléfono (8 dígitos)" onChange={handleChange} required maxLength="8" className="border p-2 rounded" />
        
        {/* Campos clásicos */}
        <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} required className="border p-2 rounded" />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required minLength="8" className="border p-2 rounded" />

        <button type="submit" className="bg-[#003A8F] text-white py-2 rounded-lg hover:bg-blue-800 transition">
          Crear Cuenta
        </button>
      </form>
    </div>
  );
};