export const formatCurrency = (amount, currency = 'GTQ') =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency }).format(amount ?? 0);

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('es-GT', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(dateStr));

export const formatDateTime = (dateStr) =>
  new Intl.DateTimeFormat('es-GT', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
