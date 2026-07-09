import React, { useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';

export const AdminTransactions = () => {
    // Extraemos las variables usando los nombres exactos que definimos en el Hook
    const { 
        transactions, 
        isLoading,     // Antes era loading
        error,         // Agregado para manejo de errores
        handleRevert, 
        pagination, 
        changePage,
        loadAllTransactions // Esta es la función que disparará la carga
    } = useTransactions();

    // Disparamos la carga de datos al montar el componente por primera vez
    useEffect(() => {
        if (loadAllTransactions) {
            loadAllTransactions();
        }
    }, []); // Array vacío para que solo se ejecute al cargar la página

    // Si hay un error de conexión (como el 401 que mencionaste), lo mostramos aquí
    if (error) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
                <p className="font-bold">Error al conectar con el servicio de banca:</p>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
                >
                    Reintentar Conexión
                </button>
            </div>
        );
    }

    if (isLoading && transactions.length === 0) {
        return <div className="text-center py-10 animate-pulse text-gray-500">Cargando historial de auditoría...</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#003A8F]">Historial de Transacciones</h2>
                    <p className="text-sm text-gray-500">Panel de control administrativo - Banco ICE</p>
                </div>
                <button 
                    onClick={loadAllTransactions}
                    className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                    Actualizar Tabla
                </button>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Código</th>
                            <th className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Tipo</th>
                            <th className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Monto</th>
                            <th className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Cuentas (Origen/Destino)</th>
                            <th className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Estado</th>
                            <th className="px-4 py-3 border-b text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <tr key={txn._id} className="text-center hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 border-b font-mono text-xs text-gray-600">
                                        {txn.transactionCode}
                                    </td>
                                    <td className="px-4 py-4 border-b">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 uppercase">
                                            {txn.transactionType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 border-b font-bold text-gray-800">
                                        {txn.currency} {txn.amount ? txn.amount.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-600">
                                        <div className="font-medium">{txn.sourceAccount || 'N/A'}</div>
                                        <div className="text-blue-400 text-xs my-0.5">↓</div>
                                        <div className="font-medium">{txn.destinationAccount || 'N/A'}</div>
                                    </td>
                                    <td className="px-4 py-4 border-b">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${
                                            txn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            txn.status === 'REVERSED' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 border-b">
                                        {txn.status !== 'REVERSED' && (
                                            <button
                                                onClick={() => {
                                                    if(window.confirm("¿Deseas revertir esta transacción? Esto afectará los saldos.")) {
                                                        handleRevert(txn._id);
                                                    }
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded shadow-sm transition"
                                            >
                                                Revertir
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-10 text-gray-400 text-center italic">
                                    No se encontraron registros de transacciones en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Controles de Paginación */}
            <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">
                    Mostrando página <span className="font-bold text-gray-700">{pagination.page}</span> de <span className="font-bold text-gray-700">{pagination.totalPages || 1}</span>
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.page === 1 || isLoading}
                        onClick={() => changePage(pagination.page - 1)}
                        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Anterior
                    </button>
                    <button 
                        disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0 || isLoading}
                        onClick={() => changePage(pagination.page + 1)}
                        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};