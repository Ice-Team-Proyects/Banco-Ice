// client-userICE/src/navigation/MainTabs.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import AccountBalanceScreen from '../features/accounts/screens/AccountBalanceScreen';
import AccountsScreen from '../features/accounts/screens/AccountsScreen';
import CreateAccountScreen from '../features/accounts/screens/CreateAccountScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import CreateServiceScreen from '../features/services/screens/CreateServiceScreen';
import ServicesScreen from '../features/services/screens/ServicesScreen';
import TransactionFormScreen from '../features/transactions/screens/TransactionFormScreen';
import TransactionsMenuScreen from '../features/transactions/screens/TransactionsMenuScreen';
import { COLORS, GRADIENTS } from '../shared/constants/theme';

// --- Accounts ---
const AccountsStackNav = createNativeStackNavigator();

function AccountsStack() {
  return (
    <AccountsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AccountsStackNav.Screen name="AccountsList" component={AccountsScreen} />
      <AccountsStackNav.Screen name="CreateAccount" component={CreateAccountScreen} />
      <AccountsStackNav.Screen name="AccountBalance" component={AccountBalanceScreen} />
    </AccountsStackNav.Navigator>
  );
}

// --- Transactions ---
const TransactionsStackNav = createNativeStackNavigator();

function TransactionsStack() {
  return (
    <TransactionsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <TransactionsStackNav.Screen name="TransactionsMenu" component={TransactionsMenuScreen} />
      <TransactionsStackNav.Screen name="TransactionForm" component={TransactionFormScreen} />
    </TransactionsStackNav.Navigator>
  );
}

// --- Services ---
const ServicesStackNav = createNativeStackNavigator();

function ServicesStack() {
  return (
    <ServicesStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ServicesStackNav.Screen name="ServicesList" component={ServicesScreen} />
      <ServicesStackNav.Screen name="CreateService" component={CreateServiceScreen} />
    </ServicesStackNav.Navigator>
  );
}

// --- Tabs ---
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Accounts: 'account-balance',
  Transactions: 'sync-alt',
  Services: 'receipt',
  Profile: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Tab bar carmesí con degradado, como el menú lateral del cliente web.
        tabBarActiveTintColor: COLORS.textOnPrimary,
        tabBarInactiveTintColor: COLORS.textOnPrimaryMuted,
        tabBarStyle: {
          backgroundColor: 'transparent',
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={GRADIENTS.sidebar}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Accounts" component={AccountsStack} options={{ title: 'Cuentas' }} />
      <Tab.Screen
        name="Transactions"
        component={TransactionsStack}
        options={{ title: 'Transacciones' }}
      />
      <Tab.Screen name="Services" component={ServicesStack} options={{ title: 'Servicios' }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.textOnPrimary,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Tab.Navigator>
  );
}
