import { Router } from 'express';
import { 
    createAccountType, 
    getAccountTypes, 
    updateAccountType, 
    deleteAccountType 
} from './accountType.controller.js';

const api = Router();

api.post('/add', createAccountType);
api.get('/get', getAccountTypes);
api.put('/update/:id', updateAccountType);
api.delete('/delete/:id', deleteAccountType);

export default api;