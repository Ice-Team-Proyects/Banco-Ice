// client-userICE/src/shared/constants/endpoints.js
// URLs base de los microservicios. Prioridad:
//   1. Variables EXPO_PUBLIC_* (ver .env.example)
//   2. Emulador Android: 10.0.2.2 (mapea al localhost de la PC; funciona aunque
//      los servicios solo escuchen en loopback)
//   3. Dispositivo físico: la IP de la máquina que sirve Metro (misma red WiFi;
//      requiere que los servicios escuchen en la LAN y el firewall lo permita)
//   4. localhost como último recurso
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];
const isAndroidEmulator = Platform.OS === 'android' && !Device.isDevice;

const devHost = isAndroidEmulator ? '10.0.2.2' : metroHost || 'localhost';

export const ENDPOINTS = {
  AUTH_LOGIN: process.env.EXPO_PUBLIC_AUTH_LOGIN_URL || `http://${devHost}:5210/api/v1/auth`,
  // El registro vive en el MISMO auth service que el login (5210), igual que en
  // el cliente web. La variable de entorno permite separarlo si algún día se
  // despliega una instancia dedicada.
  AUTH_REGISTER: process.env.EXPO_PUBLIC_AUTH_REGISTER_URL || `http://${devHost}:5210/api/v1/auth`,
  BANKING: process.env.EXPO_PUBLIC_BANKING_URL || `http://${devHost}:3050/BankingService/v1`,
};
