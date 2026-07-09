// client-userICE/src/navigation/AppNavigator.jsx
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { LoadingSpinner } from '../shared/components/common/Common';
import { COLORS } from '../shared/constants/theme';
import { useAuthStore } from '../shared/store/authStore';

// Tema de navegación acorde a la estética oscura del cliente web.
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
  },
};

/**
 * Raíz de navegación: espera la hidratación del authStore y luego decide
 * entre las tabs autenticadas (MainTabs) y el flujo público (AuthStack).
 */
export default function AppNavigator() {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <LoadingSpinner message="Preparando la aplicación..." />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
