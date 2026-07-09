import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BuildingLibraryIcon, PlusIcon, MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useServicesStore } from '../store/servicesStore.js';
// 👇 IMPORTANTE: Importamos el store de autenticación
import { useAuthStore } from '../../auth/store/authStore.js'; 

const inputCls = "w-full h-10 px-3 text-sm border border-[#e2e8f0] rounded-lg bg-[#f8fafd] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition";
const selectCls = "w-full h-10 px-3 text-sm border border-[#e2e8f0] rounded-lg bg-[#f8fafd] focus:outline-none focus:border-[#00AEEF] transition";

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const SERVICE_TYPES = ['DEPOSIT', 'TRANSFER', 'PAYMENT', 'WITHDRAWAL', 'BALANCE_INQUIRY'];
const typeLabel = {
  DEPOSIT: 'Depósito', TRANSFER: 'Transferencia', PAYMENT: 'Pago',
  WITHDRAWAL: 'Retiro', BALANCE_INQUIRY: 'Consulta',
};
const typeColor = {
  DEPOSIT: 'bg-green-100 text-green-700', TRANSFER: 'bg-blue-100 text-blue-700',
  PAYMENT: 'bg-purple-100 text-purple-700', WITHDRAWAL: 'bg-red-100 text-red-700',
  BALANCE_INQUIRY: 'bg-gray-100 text-gray-600',
};

// ── Create Service Modal ───────────────────────────────────────────────────
const CreateServiceModal = ({ onClose, user }) => {
  const { createService, loading } = useServicesStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const ok = await createService({
      ...data,
      transactionFee: Number(data.transactionFee || 0),
      createdBy: user?.id || user?._id,
    });
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-5 text-white" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
          <h2 className="text-xl font-bold">Nuevo Servicio Bancario</h2>
          <p className="text-xs opacity-75 mt-0.5">Registra un nuevo tipo de servicio</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto">
          <Field label="Nombre del Servicio" error={errors.serviceName}>
            <input className={inputCls} placeholder="Ej. Pago de Energía Eléctrica" {...register('serviceName', { required: 'Requerido' })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Código" error={errors.serviceCode}>
              <input className={inputCls} placeholder="ENERGY001" {...register('serviceCode', { required: 'Requerido' })} />
            </Field>
            <Field label="Tipo de Operación" error={errors.serviceType}>
              <select className={selectCls} {...register('serviceType', { required: 'Requerido' })}>
                <option value="">Seleccionar</option>
                {SERVICE_TYPES.map((t) => (
                  <option key={t} value={t}>{typeLabel[t]}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Comisión" error={errors.transactionFee}>
              <input type="number" step="0.01" className={inputCls} placeholder="0.00" defaultValue={0} {...register('transactionFee', { min: { value: 0, message: 'No negativo' } })} />
            </Field>
            <Field label="Moneda">
              <select className={selectCls} {...register('currency')}>
                <option value="GTQ">GTQ</option>
                <option value="USD">USD</option>
              </select>
            </Field>
          </div>
          <Field label="Descripción">
            <textarea className={inputCls + ' h-20 py-2'} placeholder="Descripción del servicio..." {...register('description')} />
          </Field>
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm transition">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-60" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
              {loading ? 'Creando...' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Services Component ───────────────────────────────────────────────
export const Services = () => {
  const { services, loading, error, fetchServices } = useServicesStore();
  // 👇 Obtenemos el usuario activo
  const { user } = useAuthStore();
  
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  // 👇 Verificamos si es administrador
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.role === 'ADMIN' || user?.role === 'admin';

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const filtered = services.filter((s) => {
    const matchSearch = [s.serviceName, s.serviceCode, s.description].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || s.serviceType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#003A8F]/10 rounded-lg flex items-center justify-center">
            <BuildingLibraryIcon className="w-5 h-5 text-[#003A8F]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0a1628]">Servicios Bancarios</h1>
            <p className="text-xs text-gray-400">{filtered.length} de {services.length} servicios</p>
          </div>
        </div>
        
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-[#003A8F] text-white rounded-lg hover:bg-[#002a6b] transition text-sm">
          <PlusIcon className="w-4 h-4" /> Nuevo Servicio
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#003A8F]/20 focus:border-[#003A8F]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#003A8F]/20"
        >
          <option value="">Todos los tipos</option>
          {SERVICE_TYPES.map((t) => <option key={t} value={t}>{typeLabel[t]}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading && <div className="flex items-center justify-center h-48 text-gray-400 text-sm animate-pulse">Cargando servicios...</div>}
      {error && <div className="flex items-center justify-center h-48 text-red-500 text-sm">{error}</div>}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <BuildingLibraryIcon className="w-10 h-10 text-gray-200" />
          <p className="text-sm text-gray-400">No hay servicios registrados</p>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((svc) => (
            <div key={svc._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#0a1628] text-sm">{svc.serviceName}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{svc.serviceCode}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColor[svc.serviceType] ?? 'bg-gray-100 text-gray-500'}`}>
                  {typeLabel[svc.serviceType] ?? svc.serviceType}
                </span>
              </div>
              {svc.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{svc.description}</p>}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Comisión: <strong className="text-[#003A8F]">{svc.currency} {Number(svc.transactionFee).toFixed(2)}</strong></span>
                <span className={`font-medium ${svc.isActive ? 'text-green-600' : 'text-red-500'}`}>
                  {svc.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateServiceModal onClose={() => setShowCreate(false)} user={user} />}
    </section>
  );
};