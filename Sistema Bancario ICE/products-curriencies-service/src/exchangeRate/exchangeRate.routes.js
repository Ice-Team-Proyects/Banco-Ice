import { Router } from 'express';
import { 
    createExchangeRate, 
    getExchangeRates, 
    updateExchangeRate, 
    convertCurrency 
} from './exchangeRate.controller.js';

const api = Router();

api.post('/add', createExchangeRate);
api.get('/get', getExchangeRates);
api.put('/update/:id', updateExchangeRate);

// Ruta especial para la Lógica de Negocio (Conversión)
api.post('/convert', convertCurrency);

export default api;