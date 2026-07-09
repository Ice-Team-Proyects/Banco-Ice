'use strict';

import { body } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateFieldService = [
    validateJWT,

    body('serviceName')
        .trim()
        .notEmpty()
        .withMessage('El nombre del servicio es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre del servicio debe tener entre 2 y 100 caracteres'),

    body('serviceCode')
        .trim()
        .notEmpty()
        .withMessage('El código del servicio es requerido')
        .isLength({ min: 2, max: 20 })
        .withMessage('El código del servicio debe tener entre 2 y 20 caracteres'),

    body('serviceType')
        .notEmpty()
        .withMessage('El tipo de servicio es requerido')
        .isIn([
            'DEPOSIT',
            'TRANSFER',
            'PAYMENT',
            'WITHDRAWAL',
            'BALANCE_INQUIRY',
        ])
        .withMessage('Tipo de servicio bancario no válido'),

    body('transactionFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('La comisión debe ser mayor o igual a 0'),

    body('currency')
        .optional()
        .isIn(['GTQ', 'USD'])
        .withMessage('Moneda no válida'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('La descripción no puede exceder 300 caracteres'),

    checkValidators,
];
