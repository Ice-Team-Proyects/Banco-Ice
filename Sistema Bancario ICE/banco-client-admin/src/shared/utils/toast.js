import toast from 'react-hot-toast';

const base = {
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: '14px 20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
};

export const showSuccess = (msg) =>
  toast.success(msg, {
    style: { ...base, background: '#003A8F', color: '#fff', borderLeft: '4px solid #FFD200' },
    iconTheme: { primary: '#FFD200', secondary: '#003A8F' },
  });

export const showError = (msg) =>
  toast.error(msg, {
    style: { ...base, background: '#fff', color: '#e24b4a', borderLeft: '4px solid #e24b4a' },
    iconTheme: { primary: '#e24b4a', secondary: '#fff' },
  });

export const showInfo = (msg) =>
  toast(msg, {
    style: { ...base, background: '#00AEEF', color: '#fff', borderLeft: '4px solid #003A8F' },
    iconTheme: { primary: '#003A8F', secondary: '#fff' },
  });
