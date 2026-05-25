export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-GT', { year: 'numeric', month: '2-digit', day: '2-digit' });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' });

export const formatCurrency = (amount, currency = 'GTQ') => {
  const symbol = currency === 'USD' ? '$ ' : 'Q ';
  return `${symbol}${Number(amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;
};

export const formatDateForInput = (iso) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
