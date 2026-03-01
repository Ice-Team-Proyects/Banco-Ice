'use strict';

import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateTransaction = [
    validateJWT,

    body('transactionType')
        .notEmpty()
        .withMessage('El tipo de transacción es requerido')
        .isIn([
            'DEPOSIT',
            'TRANSFER',
            'PAYMENT',
            'WITHDRAWAL',
            'BALANCE_INQUIRY',
        ])
        .withMessage('Tipo de transacción no válido'),

    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isFloat({ min: 0.01 })
        .withMessage('El monto debe ser mayor a 0'),

    body('currency')
        .optional()
        .isIn(['GTQ', 'USD'])
        .withMessage('Moneda no válida'),

    body('sourceAccount')
        .optional()
        .trim()
        .isLength({ min: 5, max: 50 })
        .withMessage('La cuenta origen debe tener entre 5 y 50 caracteres'),

    body('destinationAccount')
        .optional()
        .trim()
        .isLength({ min: 5, max: 50 })
        .withMessage('La cuenta destino debe tener entre 5 y 50 caracteres'),

    body('externalReference')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La referencia externa no puede exceder 100 caracteres'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción no puede exceder 300 caracteres'),

    body('fieldService')
        .notEmpty()
        .withMessage('El ID del servicio bancario es requerido')
        .isMongoId()
        .withMessage('El ID del servicio bancario no es válido'),

    checkValidators,
];

export const validateUpdateTransactionStatus = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la transacción no es válido'),

    body('status')
        .notEmpty()
        .withMessage('El estado es requerido')
        .isIn(['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'])
        .withMessage('Estado de transacción no válido'),

    checkValidators,
];
