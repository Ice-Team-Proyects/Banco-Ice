import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BanknotesIcon, PlusIcon, MagnifyingGlassIcon,
  ArrowDownIcon, ArrowsRightLeftIcon, PencilIcon, TrashIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAccountsStore } from '../store/accountsStore.js';
import { useServicesStore } from '../../services/store/servicesStore.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { useAuthStore } from '../../auth/store/authStore.js'; 
import { formatCurrency } from '../../../shared/utils/formatter.js';

// ── Modal base ─────────────────────────────────────────────────────────────
const Modal = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
      <div className="p-5 text-white" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5 overflow-y-auto space-y-4">{children}</div>
    </div>
  </div>
);

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#344060] uppercase tracking-wide mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const inputCls = "w-full h-10 px-3 text-sm border border-[#e2e8f0] rounded-lg bg-[#f8fafd] focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition";
const selectCls = "w-full h-10 px-3 text-sm border border-[#e2e8f0] rounded-lg bg-[#f8fafd] focus:outline-none focus:border-[#00AEEF] transition";

// ── Edit Account Modal ───────────────────────────────────────────────────
const EditAccountModal = ({ account, onClose }) => {
  const { updateAccount, loading, fetchAccounts } = useAccountsStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ownerName: account.ownerName,
      ownerDPI: account.ownerDPI,
      accountType: account.accountType,
      dailyLimit: account.dailyLimit,
      isActive: account.isActive ? 'true' : 'false',
    }
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      isActive: data.isActive === 'true',
    };
    const ok = await updateAccount(account._id, payload);
    if (ok) {
      await fetchAccounts();
      onClose();
    }
  };

  return (
    <Modal title="Editar Cuenta Bancaria" subtitle={`Cuenta: ${account.accountNumber}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de Cuenta" error={errors.accountType}>
            <select className={selectCls} {...register('accountType', { required: 'Requerido' })}>
              <option value="SAVINGS">Ahorro</option>
              <option value="CHECKING">Monetaria</option>
            </select>
          </Field>
          <Field label="Estado" error={errors.isActive}>
            <select className={selectCls} {...register('isActive')}>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </Field>
        </div>
        <Field label="Nombre del Titular" error={errors.ownerName}>
          <input className={inputCls} placeholder="Nombre completo" {...register('ownerName', { required: 'Requerido' })} />
        </Field>
        <Field label="DPI del Titular" error={errors.ownerDPI}>
          <input className={inputCls} placeholder="13 dígitos" {...register('ownerDPI', { required: 'Requerido', minLength: { value: 13, message: 'Mínimo 13 dígitos' } })} />
        </Field>
        <Field label="Límite Diario" error={errors.dailyLimit}>
          <input type="number" className={inputCls} placeholder="10000" {...register('dailyLimit', { min: { value: 0, message: 'No puede ser negativo' } })} />
        </Field>
        <div className="flex justify-end gap-3 pt-2 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm transition">Cancelar</button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-60" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ── Create Account Modal ───────────────────────────────────────────────────
const CreateAccountModal = ({ onClose, isAdmin, user }) => {
  const { createAccount, loading, fetchAccounts } = useAccountsStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const ownerName = user
    ? `${user.firstName || user.name || user.username || 'Usuario'} ${user.lastName || ''}`.trim()
    : 'Usuario';

  const onSubmit = async (data) => {
    if (!isAdmin && user) {
      data.userId = user.id || user._id;
    }
    data.ownerName = ownerName;
    // Generar un DPI automático de 13 dígitos: timestamp + random
    const timestamp = Date.now().toString().slice(-9); // 9 dígitos
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 dígitos
    data.ownerDPI = (timestamp + random).slice(0, 13); // Asegurar exactamente 13 dígitos
    const ok = await createAccount(data);
    if (ok) {
      await fetchAccounts();
      onClose();
    }
  };

  return (
    <Modal title="Nueva Cuenta Bancaria" subtitle="Registra una nueva cuenta en el sistema" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de Cuenta" error={errors.accountType}>
            <select className={selectCls} {...register('accountType', { required: 'Requerido' })}>
              <option value="">Seleccionar</option>
              <option value="SAVINGS">Ahorro</option>
              <option value="CHECKING">Monetaria</option>
            </select>
          </Field>
          <Field label="Moneda" error={errors.currency}>
            <select className={selectCls} {...register('currency')}>
              <option value="GTQ">GTQ (Quetzales)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
          </Field>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafd] p-4 text-sm text-[#344060]">
          <p className="text-xs uppercase tracking-[0.25em] text-[#6b7280]">Titular asignado</p>
          <p className="mt-2 font-semibold text-[#0f172a]">{ownerName}</p>
        </div>

        {isAdmin && (
          <Field label="ID de Usuario (opcional)" error={errors.userId}>
            <input className={inputCls} placeholder="ID del usuario del sistema" {...register('userId')} />
          </Field>
        )}


        <div className="flex justify-end gap-3 pt-2 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm transition">Cancelar</button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-60" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ── Operation Modal (Deposit / Transfer) ─────────────────────
const OperationModal = ({ type, account, onClose }) => {
  const { deposit, transfer, loading, fetchAccounts } = useAccountsStore();
  const { services, fetchServices } = useServicesStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const titles = { deposit: 'Realizar Depósito', transfer: 'Realizar Transferencia' };
  const subtitles = {
    deposit: `Cuenta destino: ${account?.accountNumber}`,
    transfer: `Cuenta origen: ${account?.accountNumber}`,
  };

  const onSubmit = async (data) => {
    let ok = false;
    if (type === 'deposit') ok = await deposit({ accountNumber: account.accountNumber, amount: Number(data.amount), fieldService: data.fieldService, description: data.description });
    if (type === 'transfer') ok = await transfer({ sourceAccountNumber: account.accountNumber, destinationAccountNumber: data.destinationAccountNumber, amount: Number(data.amount), fieldService: data.fieldService, description: data.description });
    
    if (ok) {
      await fetchAccounts(); 
      onClose();
    }
  };

  return (
    <Modal title={titles[type]} subtitle={subtitles[type]} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* 👇 AQUÍ ESTÁ EL CAMBIO: Ya no hay opciones manuales invalidas */}
        <Field label="Servicio Bancario" error={errors.fieldService}>
          <select className={selectCls} {...register('fieldService', { required: 'Selecciona un servicio' })}>
            <option value="">Seleccionar servicio</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>{s.serviceName} — {s.serviceCode}</option>
            ))}
          </select>
        </Field>

        {type === 'transfer' && (
          <Field label="Cuenta Destino" error={errors.destinationAccountNumber}>
            <input className={inputCls} placeholder="Número de cuenta destino" {...register('destinationAccountNumber', { required: 'Requerido' })} />
          </Field>
        )}
        <Field label="Monto" error={errors.amount}>
          <input type="number" step="0.01" className={inputCls} placeholder="0.00" {...register('amount', { required: 'Requerido', min: { value: 0.01, message: 'Monto inválido' } })} />
        </Field>
        <Field label="Descripción (opcional)">
          <input className={inputCls} placeholder="Descripción de la operación" {...register('description')} />
        </Field>
        <div className="flex justify-end gap-3 pt-2 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm transition">Cancelar</button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-60" style={{ background: 'linear-gradient(90deg,#003A8F,#1a5cb8)' }}>
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ── Main Accounts Component ────────────────────────────────────────────────
export const Accounts = () => {
  const { accounts, loading, fetchAccounts, deleteAccount } = useAccountsStore();
  const { openConfirm } = useUIStore();
  const { user } = useAuthStore(); 
  
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [operation, setOperation] = useState(null); 
  const [editAccount, setEditAccount] = useState(null);

  const isAdmin = user?.role === 'ADMIN_ROLE';

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const handleDelete = (account) => {
    openConfirm({
      title: 'Eliminar Cuenta',
      message: `¿Estás seguro de que deseas eliminar la cuenta ${account.accountNumber}? Esta acción no se puede deshacer.`,
      onConfirm: () => deleteAccount(account._id)
    });
  };

  const userAccounts = isAdmin ? accounts : accounts.filter((a) => a.userId === (user?.id || user?._id));

  const filtered = userAccounts.filter((a) =>
    [a.accountNumber, a.ownerName, a.ownerDPI].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const typeBadge = { SAVINGS: 'bg-blue-100 text-blue-700', CHECKING: 'bg-purple-100 text-purple-700' };
  const typeLabel = { SAVINGS: 'Ahorro', CHECKING: 'Monetaria' };

  const canCreateAccount = isAdmin || userAccounts.length < 3;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#003A8F]/10 rounded-lg flex items-center justify-center">
            <BanknotesIcon className="w-5 h-5 text-[#003A8F]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0a1628]">Cuentas Bancarias</h1>
            <p className="text-xs text-gray-400">{filtered.length} de {userAccounts.length} cuentas</p>
          </div>
        </div>

        {canCreateAccount ? (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-[#003A8F] text-white rounded-lg hover:bg-[#002a6b] transition text-sm">
            <PlusIcon className="w-4 h-4" /> Nueva Cuenta
          </button>
        ) : (
          !isAdmin && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
              Límite de cuentas alcanzado
            </span>
          )
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por número, titular o DPI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003A8F]/20 focus:border-[#003A8F] text-sm"
        />
      </div>

      <div className={isAdmin ? "bg-white rounded-2xl border border-gray-200 overflow-hidden" : ""}>
        {loading && <div className="flex items-center justify-center h-48 text-gray-400 text-sm animate-pulse">Cargando cuentas...</div>}
        
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-2 bg-white rounded-2xl border border-gray-200">
            <BanknotesIcon className="w-10 h-10 text-gray-200" />
            <p className="text-sm text-gray-400">No hay cuentas registradas</p>
          </div>
        )}
        
        {/* Vista Admin: Tabla */}
        {!loading && filtered.length > 0 && isAdmin && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafd] border-b border-gray-100">
                {['N° Cuenta', 'Titular', 'Tipo', 'Saldo', 'Moneda', 'Estado', 'Operaciones'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc) => (
                <tr key={acc._id} className="border-b border-gray-50 hover:bg-[#f8fafd] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-[#003A8F] font-semibold">{acc.accountNumber}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[#0a1628]">{acc.ownerName}</p>
                    <p className="text-xs text-gray-400">DPI: {acc.ownerDPI}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadge[acc.accountType] ?? 'bg-gray-100 text-gray-500'}`}>
                      {typeLabel[acc.accountType] ?? acc.accountType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#0a1628]">{formatCurrency(acc.balance, acc.currency)}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{acc.currency}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${acc.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      {acc.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setOperation({ type: 'deposit', account: acc })}
                        title="Depósito"
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                      >
                        <ArrowDownIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setOperation({ type: 'transfer', account: acc })}
                        title="Transferencia"
                        className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      >
                        <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditAccount(acc)}
                        title="Editar Cuenta"
                        className="p-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition ml-2"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(acc)}
                        title="Eliminar Cuenta"
                        className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Vista Usuario: Cards */}
        {!loading && filtered.length > 0 && !isAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((acc) => (
              <div key={acc._id} className="relative overflow-hidden rounded-[1.75rem] bg-[#11131b] border border-white/10 p-6 shadow-[0_28px_60px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#7c1f20] via-[#2c0909] to-[#11131b] opacity-95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_32%)] pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#ffb8b2] ring-1 ring-white/10">
                    <BanknotesIcon className="w-6 h-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f8d6cc]">
                    {typeLabel[acc.accountType] ?? acc.accountType}
                  </span>
                </div>

                <div className="relative z-10 mb-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#7f8c9d]">Cuenta</p>
                  <h3 className="mt-3 text-3xl font-semibold text-white tracking-tight">{acc.accountNumber}</h3>
                </div>

                <div className="relative z-10 mb-6">
                  <p className="text-sm text-[#b8bec8]">Saldo Disponible</p>
                  <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(acc.balance, acc.currency)}</p>
                </div>

                <div className="relative z-10 mb-6 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-[#d1d7e0] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#8b98ad]">Titular</span>
                    <span className="font-semibold text-white truncate">{acc.ownerName}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#8b98ad]">DPI</span>
                    <span className="font-semibold text-white truncate">{acc.ownerDPI}</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setOperation({ type: 'transfer', account: acc })}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#182339]"
                  >
                    <span>Transferir</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${acc.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                    {acc.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && <CreateAccountModal onClose={() => setShowCreate(false)} isAdmin={isAdmin} user={user} />}
      {editAccount && <EditAccountModal account={editAccount} onClose={() => setEditAccount(null)} />}
      {operation && (
        <OperationModal
          type={operation.type}
          account={operation.account}
          onClose={() => setOperation(null)}
        />
      )}
    </section>
  );
};