// client-userICE/src/shared/constants/theme.js
// Única fuente de verdad para colores, espaciados, tipografía y sombras.
// Paleta "Banco ICE / Hinokami" tomada del cliente web (banco-client-admin):
// fondo oscuro, tarjetas crema marfil, carmesí + naranja fuego + arena.
// No hardcodear colores fuera de este archivo.

export const COLORS = {
  primary: '#8b0000', // carmesí
  primaryDark: '#5f0000',
  primarySoft: 'rgba(139, 0, 0, 0.10)', // fondos suaves de íconos (como bg-[#8b0000]/10 web)
  accent: '#ff5625', // naranja fuego
  sand: '#dac49b', // arena / dorado
  sandSoft: 'rgba(218, 196, 155, 0.12)',
  background: '#0a0a0a', // fondo casi negro (mejor en pantallas OLED, evita smearing del #000 puro)
  surface: '#FDF5E6', // tarjetas crema marfil
  text: '#1c1917', // texto principal sobre crema (stone-900)
  secondary: '#78716c', // texto secundario sobre crema (stone-500)
  textLight: '#a8a29e', // texto tenue, legible en crema y en oscuro (stone-400)
  textOnDark: '#FDF5E6', // títulos y texto sobre el fondo oscuro
  error: '#ef4444',
  success: '#16a34a',
  warning: '#d97706',
  border: 'rgba(28, 25, 23, 0.15)', // bordes sobre crema
  borderOnDark: 'rgba(253, 245, 230, 0.15)', // bordes sobre oscuro
  white: '#FDF5E6', // texto sobre botones/degradados (la web usa crema, no blanco puro)
  textOnPrimary: '#FDF5E6', // texto/íconos sobre el carmesí (tab bar, headers)
  textOnPrimaryMuted: 'rgba(253, 245, 230, 0.55)', // ítems inactivos de la tab bar
  overlay: 'rgba(0, 0, 0, 0.55)',
};

// Degradados tomados del cliente web.
export const GRADIENTS = {
  // Botones principales (idéntico al botón del login web).
  primary: ['#8b0000', '#ff5625', '#dac49b'],
  // Sidebar/menú de la web: carmesí que se oscurece hacia abajo.
  sidebar: ['#8b0000', '#6b0000', '#3b0000'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 34,
};

export const SHADOWS = {
  small: {
    shadowColor: '#ff5625',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#ff5625',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  large: {
    shadowColor: '#ff5625',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
};
