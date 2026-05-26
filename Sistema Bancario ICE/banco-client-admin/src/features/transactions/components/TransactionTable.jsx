import React from "react";

export const TransactionTable = ({ transactions, isAdmin, onRevert }) => {
  
  // Diccionario para traducir los tipos de transacción del modelo a la vista
  const typeLabels = {
    DEPOSIT: "Depósito",
    TRANSFER: "Transferencia",
    PAYMENT: "Pago",
    WITHDRAWAL: "Retiro",
    BALANCE_INQUIRY: "Consulta",
  };

  // Mapa de colores dinámicos basados en el ENUM de tu schema
  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    REVERSED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md sm:rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">
              Código
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Fecha
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Tipo
            </th>
            <th scope="col" className="px-6 py-4 font-semibold">
              Cuentas (Origen → Destino)
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">
              Monto
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-center">
              Estado
            </th>
            {/* Renderizado condicional: Solo el Admin ve la columna de Acciones */}
            {isAdmin && (
              <th scope="col" className="px-6 py-4 font-semibold text-center">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 7 : 6}
                className="px-6 py-8 text-center text-gray-500"
              >
                No se encontraron transacciones registradas.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr
                key={tx._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-gray-900 whitespace-nowrap">
                  {tx.transactionCode}
                </td>
                <td className="px-6 py-4">
                  {new Date(tx.transactionDate).toLocaleString("es-GT", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-6 py-4 font-medium">
                  {typeLabels[tx.transactionType] || tx.transactionType}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500">
                      <span className="font-semibold text-gray-700">O:</span>{" "}
                      {tx.sourceAccount || "N/A"}
                    </span>
                    <span className="text-gray-500">
                      <span className="font-semibold text-gray-700">D:</span>{" "}
                      {tx.destinationAccount || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-right whitespace-nowrap">
                  {/* Detección automática de la moneda basada en el enum de Mongoose */}
                  {tx.currency === "GTQ" ? "Q " : "$ "}
                  {tx.amount.toLocaleString("es-GT", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusStyles[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                </td>

                {/* Lógica exclusiva del lado del Administrador */}
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    {tx.status === "COMPLETED" ? (
                      <button
                        onClick={() => onRevert(tx._id)}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Revertir
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
