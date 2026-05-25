import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner } from '../../auth/components/Spinner.jsx';

export const CreateUserModal = ({ onClose, onCreate, loading }) => {
    const [localError, setLocalError] = useState('');
    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm();

    const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-[#f8fafd] focus:outline-none focus:border-[#003A8F] focus:ring-2 focus:ring-[#003A8F]/20 transition';

    const submit = async (values) => {
        setLocalError('');
        // La API espera multipart/form-data
        const formData = new FormData();
        formData.append('Name',     values.name);
        formData.append('Surname',  values.surname);
        formData.append('Username', values.username);
        formData.append('Email',    values.email);
        formData.append('Password', values.password);
        formData.append('Phone',    values.phone);
        if (values.profilePicture?.[0]) {
            formData.append('ProfilePicture', values.profilePicture[0]);
        }
        const ok = await onCreate(formData);
        if (ok) { reset(); onClose(); }
        else setLocalError('No se pudo crear el usuario. Verifica los datos.');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 text-white" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
                    <h2 className="text-xl font-bold">Nuevo Usuario</h2>
                    <p className="text-xs opacity-75 mt-0.5">Completa la información para registrar un nuevo usuario</p>
                </div>

                <form onSubmit={handleSubmit(submit)} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                    {/* Nombre / Apellido */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Nombre</label>
                            <input
                                className={inputCls}
                                placeholder="Pedro"
                                {...register('name', {
                                    required: 'El nombre es obligatorio',
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                })}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Apellido</label>
                            <input
                                className={inputCls}
                                placeholder="García"
                                {...register('surname', {
                                    required: 'El apellido es obligatorio',
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                })}
                            />
                            {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname.message}</p>}
                        </div>
                    </div>

                    {/* Username / Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Nombre de Usuario</label>
                            <input
                                className={inputCls}
                                placeholder="pgarcia"
                                {...register('username', {
                                    required: 'El nombre de usuario es obligatorio',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                })}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Teléfono (8 dígitos)</label>
                            <input
                                className={inputCls}
                                placeholder="55551234"
                                type="tel"
                                {...register('phone', {
                                    required: 'El teléfono es obligatorio',
                                    pattern: { value: /^\d{8}$/, message: 'Debe ser exactamente 8 dígitos' },
                                })}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Email</label>
                        <input
                            className={inputCls}
                            placeholder="pedro@banco.gt"
                            type="email"
                            {...register('email', {
                                required: 'El email es obligatorio',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de email inválido' },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Contraseña / Confirmar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Contraseña</label>
                            <input
                                className={inputCls}
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                {...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                                    maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">Confirmar contraseña</label>
                            <input
                                className={inputCls}
                                type="password"
                                placeholder="Repite la contraseña"
                                {...register('confirmPassword', {
                                    required: 'Confirma la contraseña',
                                    validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
                                })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    {/* Foto de perfil (opcional) */}
                    <div>
                        <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">
                            Foto de Perfil <span className="text-gray-400 normal-case font-normal">(opcional)</span>
                        </label>
                        <input
                            className={inputCls + ' cursor-pointer'}
                            type="file"
                            accept="image/*"
                            {...register('profilePicture')}
                        />
                    </div>

                    {localError && (
                        <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3">{localError}</p>
                    )}

                    {/* Nota sobre verificación */}
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                        ⚠️ El usuario recibirá un email para verificar su cuenta antes de poder iniciar sesión.
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg text-white font-medium transition shadow disabled:opacity-60 text-sm"
                            style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}
                        >
                            {loading ? <Spinner small /> : 'Crear usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
