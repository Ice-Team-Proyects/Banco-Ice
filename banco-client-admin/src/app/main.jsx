import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';          // ✅ Fix: era '../app/App.jsx'
import '../styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '14px',
            borderRadius: '10px',
          },
          success: { style: { borderLeft: '4px solid #003A8F' } },
          error:   { style: { borderLeft: '4px solid #e24b4a' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
