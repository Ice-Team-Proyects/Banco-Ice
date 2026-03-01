'use strict';

import { Router } from 'express';
import {
    createAccount,
    getAccounts,
    deposit,
    transfer,
    payment,
    withdrawal,
    getBalance,
} from './account.controller.js';

import {
    validateCreateAccount,
    validateDeposit,
    validateTransfer,
    validatePayment,
    validateWithdrawal,
    validateGetBalance,
} from '../../middlewares/account-validator.js';

const router = Router();

router.post('/deposit', validateDeposit, deposit);
router.post('/transfer', validateTransfer, transfer);
router.post('/payment', validatePayment, payment);
router.post('/withdrawal', validateWithdrawal, withdrawal);
router.get('/balance/:accountNumber', validateGetBalance, getBalance);

// ─── Cuentas ──────────────────────────────────────────────────────────────────
router.get('/', getAccounts);
router.post('/', validateCreateAccount, createAccount);

export default router;
