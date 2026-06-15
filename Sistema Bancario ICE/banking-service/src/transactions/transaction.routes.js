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

import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.use(validateJWT); 

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Obtener el historial de transacciones
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las transacciones obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionCode:
 *                     type: string
 *                   transactionType:
 *                     type: string
 *                   status:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   sourceAccount:
 *                     type: string
 *                   destinationAccount:
 *                     type: string
 *                   description:
 *                     type: string
 *                   transactionDate:
 *                     type: string
 *                     format: date-time
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                   isActive:
 *                     type: boolean
 */
router.get('/', getTransactions);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Crear una nueva transacción manual
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionType
 *               - amount
 *               - fieldService
 *             properties:
 *               transactionType:
 *                 type: string
 *                 enum: [DEPOSIT, TRANSFER, PAYMENT, WITHDRAWAL, BALANCE_INQUIRY]
 *                 example: "TRANSFER"
 *               amount:
 *                 type: number
 *                 example: 100
 *               currency:
 *                 type: string
 *                 enum: [GTQ, USD]
 *                 example: "GTQ"
 *               sourceAccount:
 *                 type: string
 *                 example: "123456789"
 *               destinationAccount:
 *                 type: string
 *                 example: "987654321"
 *               fieldService:
 *                 type: string
 *                 example: "662f1c9e5f1a2b3c4d5e6f7a"
 *               description:
 *                 type: string
 *                 example: "Transferencia entre cuentas"
 *               externalReference:
 *                 type: string
 *                 example: "REF123456"
 *     responses:
 *       201:
 *         description: Transacción registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     transactionCode:
 *                       type: string
 *                       example: "TXN001"
 *                     transactionType:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "PENDING"
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     sourceAccount:
 *                       type: string
 *                     destinationAccount:
 *                       type: string
 *                     fieldService:
 *                       type: string
 *                     description:
 *                       type: string
 *                     transactionDate:
 *                       type: string
 *                       format: date-time
 *                     isActive:
 *                       type: boolean
 */
router.post('/', validateCreateTransaction, createTransaction);

/**
 * @swagger
 * /transactions/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una transacción
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la transacción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED, REVERSED]
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Estado actualizado con éxito
 *       404:
 *         description: Transacción no encontrada
 */
router.patch(
    '/:id/status',
    validateUpdateTransactionStatus,
    patchTransactionStatus
);

export default router;