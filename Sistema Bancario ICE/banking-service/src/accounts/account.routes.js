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

import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.use(validateJWT); 

// ─── Operaciones ──────────────────────────────────────────────────────────────

/**
 * @swagger
 * /accounts/deposit:
 *   post:
 *     summary: Realizar un depósito en una cuenta
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - amount
 *               - fieldService
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "GTQ-5649300566"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               fieldService:
 *                 type: string
 *                 example: "6996c419174e9e49bf0befe3"
 *               description:
 *                 type: string
 *                 example: "Depósito en ventanilla"
 *     responses:
 *       200:
 *         description: Depósito realizado exitosamente
 *       400:
 *         description: Error en los datos del depósito
 */
router.post('/deposit', validateDeposit, deposit);

/**
 * @swagger
 * /accounts/transfer:
 *   post:
 *     summary: Realizar una transferencia entre cuentas
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceAccountNumber
 *               - destinationAccountNumber
 *               - amount
 *               - fieldService
 *             properties:
 *               sourceAccountNumber:
 *                 type: string
 *                 example: "GTQ-5649300566"
 *               destinationAccountNumber:
 *                 type: string
 *                 example: "GTQ-7080358366"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               fieldService:
 *                 type: string
 *                 example: "6996c23f7acd4c9f7c8c3430"
 *               description:
 *                 type: string
 *                 example: "Pago de préstamo"
 *     responses:
 *       200:
 *         description: Transferencia realizada exitosamente
 *       400:
 *         description: Error en los datos de la transferencia
 */
router.post('/transfer', validateTransfer, transfer);

/**
 * @swagger
 * /accounts/payment:
 *   post:
 *     summary: Realizar un pago de servicio
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceAccountNumber
 *               - amount
 *               - fieldService
 *             properties:
 *               sourceAccountNumber:
 *                 type: string
 *                 example: "GTQ-5649300566"
 *               amount:
 *                 type: number
 *                 example: 500
 *               fieldService:
 *                 type: string
 *                 example: "69a3ecaa303d5e5c0a18989c"
 *               externalReference:
 *                 type: string
 *                 example: "AGUA-2026-001"
 *               description:
 *                 type: string
 *                 example: "Pago agua febrero"
 *     responses:
 *       200:
 *         description: Pago realizado exitosamente
 *       400:
 *         description: Error en los datos del pago
 */
router.post('/payment', validatePayment, payment);

/**
 * @swagger
 * /accounts/withdrawal:
 *   post:
 *     summary: Realizar un retiro de una cuenta
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceAccountNumber
 *               - amount
 *               - fieldService
 *             properties:
 *               sourceAccountNumber:
 *                 type: string
 *                 example: "GTQ-5649300566"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               fieldService:
 *                 type: string
 *                 example: "69a3ed72a61728f64e2f6edb"
 *               description:
 *                 type: string
 *                 example: "Retiro en cajero"
 *     responses:
 *       200:
 *         description: Retiro realizado exitosamente
 *       400:
 *         description: Error en los datos del retiro
 */
router.post('/withdrawal', validateWithdrawal, withdrawal);

// ─── Cuentas ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /accounts/balance/{accountNumber}:
 *   get:
 *     summary: Consultar el saldo de una cuenta específica
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de cuenta a consultar
 *     responses:
 *       200:
 *         description: Saldo obtenido correctamente
 */
router.get('/balance/:accountNumber', validateGetBalance, getBalance);

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Obtener todas las cuentas registradas
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cuentas bancarias
 */
router.get('/', getAccounts);

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Crear una nueva cuenta bancaria
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountType
 *               - ownerName
 *               - ownerDPI
 *             properties:
 *               accountType:
 *                 type: string
 *                 enum: [SAVINGS, CHECKING]
 *                 example: "SAVINGS"
 *               ownerName:
 *                 type: string
 *                 example: "Kenet Joj"
 *               ownerDPI:
 *                 type: string
 *                 example: "1543789270987"
 *               dailyLimit:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Cuenta creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 account:
 *                   type: object
 *                   properties:
 *                     accountType:
 *                       type: string
 *                       example: "SAVINGS"
 *                     ownerName:
 *                       type: string
 *                       example: "Kenet Joj"
 *                     ownerDPI:
 *                       type: string
 *                       example: "1543789270987"
 *                     dailyLimit:
 *                       type: number
 *                       example: 10000
 */
router.post('/', validateCreateAccount, createAccount);

export default router;