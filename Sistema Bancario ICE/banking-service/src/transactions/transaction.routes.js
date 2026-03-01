'use strict';

import { Router } from 'express';
import {
    createTransaction,
    getTransactions,
    patchTransactionStatus,
} from './transaction.controller.js';

import {
    validateCreateTransaction,
    validateUpdateTransactionStatus,
} from '../../middlewares/transaction-validator.js';

const router = Router();

router.get(
    '/',
    getTransactions
);

router.post(
    '/',
    validateCreateTransaction,
    createTransaction
);

router.patch(
    '/:id/status',
    validateUpdateTransactionStatus,
    patchTransactionStatus
);

export default router;
