// client-userICE/src/shared/api/bankingClient.js
import axios from 'axios';

import { ENDPOINTS } from '../constants/endpoints';
import { attachAuthInterceptors } from './authClient';

// Cliente del BankingService (cuentas, transacciones y servicios).
// Comparte con authClient el Bearer del authStore y la cola de refresh:
// ante un 401 refresca el token una vez y reintenta; si falla, hace logout.
const bankingClient = axios.create({
  baseURL: ENDPOINTS.BANKING,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

attachAuthInterceptors(bankingClient);

export default bankingClient;
