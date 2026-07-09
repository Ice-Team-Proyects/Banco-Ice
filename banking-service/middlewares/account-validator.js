'use strict';

import { body, param, query } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

// ─── Crear cuenta ────────────────────────────────────────────────────────────

export const validateCreateAccount = [
    validateJWT,

    body('accountType')
        .notEmpty()
        .withMessage('El tipo de cuenta es requerido')
        .isIn(['SAVINGS', 'CHECKING'])
        .withMessage('Tipo de cuenta no válido. Use SAVINGS o CHECKING'),

    body('ownerName')
        .trim()
        .notEmpty()
        .withMessage('El nombre del titular es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

    body('ownerDPI')
        .trim()
        .notEmpty()
        .withMessage('El DPI del titular es requerido')
        .isLength({ min: 13, max: 13 })
        .withMessage('El DPI debe tener exactamente 13 dígitos')
        .isNumeric()
        .withMessage('El DPI solo debe contener números'),

    body('currency')
        .optional()
        .isIn(['GTQ', 'USD'])
        .withMessage('Moneda no válida'),

    body('dailyLimit')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El límite diario debe ser mayor o igual a 0'),

    checkValidators,
];

// ─── Depósito ────────────────────────────────────────────────────────────────

export const validateDeposit = [
    validateJWT,

    body('accountNumber')
        .trim()
        .notEmpty()
        .withMessage('El número de cuenta es requerido'),

    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isFloat({ min: 0.01 })
        .withMessage('El monto debe ser mayor a 0'),

    body('fieldService')
        .notEmpty()
        .withMessage('El ID del servicio bancario es requerido')
        .isMongoId()
        .withMessage('El ID del servicio bancario no es válido'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción no puede exceder 300 caracteres'),

    checkValidators,
];

// ─── Transferencia ───────────────────────────────────────────────────────────

export const validateTransfer = [
    validateJWT,

    body('sourceAccountNumber')
        .trim()
        .notEmpty()
        .withMessage('La cuenta origen es requerida'),

    body('destinationAccountNumber')
        .trim()
        .notEmpty()
        .withMessage('La cuenta destino es requerida'),

    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isFloat({ min: 0.01 })
        .withMessage('El monto debe ser mayor a 0'),

    body('fieldService')
        .notEmpty()
        .withMessage('El ID del servicio bancario es requerido')
        .isMongoId()
        .withMessage('El ID del servicio bancario no es válido'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción no puede exceder 300 caracteres'),

    checkValidators,
];

// ─── Pago de servicio ────────────────────────────────────────────────────────

export const validatePayment = [
    validateJWT,

    body('sourceAccountNumber')
        .trim()
        .notEmpty()
        .withMessage('El número de cuenta es requerido'),

    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isFloat({ min: 0.01 })
        .withMessage('El monto debe ser mayor a 0'),

    body('fieldService')
        .notEmpty()
        .withMessage('El ID del servicio bancario es requerido')
        .isMongoId()
        .withMessage('El ID del servicio bancario no es válido'),

    body('externalReference')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La referencia no puede exceder 100 caracteres'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción no puede exceder 300 caracteres'),

    checkValidators,
];

// ─── Retiro ──────────────────────────────────────────────────────────────────

export const validateWithdrawal = [
    validateJWT,

    body('sourceAccountNumber')
        .trim()
        .notEmpty()
        .withMessage('El número de cuenta es requerido'),

    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isFloat({ min: 0.01 })
        .withMessage('El monto debe ser mayor a 0'),

    body('fieldService')
        .notEmpty()
        .withMessage('El ID del servicio bancario es requerido')
        .isMongoId()
        .withMessage('El ID del servicio bancario no es válido'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción no puede exceder 300 caracteres'),

    checkValidators,
];

// ─── Consulta de saldo ───────────────────────────────────────────────────────

export const validateGetBalance = [
    validateJWT,

    param('accountNumber')
        .trim()
        .notEmpty()
        .withMessage('El número de cuenta es requerido'),

    checkValidators,
];
