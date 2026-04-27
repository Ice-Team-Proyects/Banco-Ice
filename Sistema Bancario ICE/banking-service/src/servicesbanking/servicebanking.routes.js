'use strict';

import { Router } from 'express';
import {
    createFieldService,
    getFieldServices
} from './servicebanking.controller.js';

import { validateCreateFieldService } from '../../middlewares/field-service-validator.js';
import { validateJWT } from '../../middlewares/validate-jwt.js'; 

const router = Router();

router.use(validateJWT); 

/**
 * @swagger
 * /servicesbanking:
 *   get:
 *     summary: Obtener todos los servicios bancarios
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios bancarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   serviceName:
 *                     type: string
 *                     example: "Pago de Energía"
 *                   serviceCode:
 *                     type: string
 *                     example: "ENERGY001"
 *                   serviceType:
 *                     type: string
 *                     example: "PAYMENT"
 *                   description:
 *                     type: string
 *                     example: "Pago de servicio eléctrico"
 *                   transactionFee:
 *                     type: number
 *                     example: 5
 *                   currency:
 *                     type: string
 *                     example: "GTQ"
 *                   isActive:
 *                     type: boolean
 *                     example: true
 */
router.get('/', getFieldServices);

/**
 * @swagger
 * /servicesbanking:
 *   post:
 *     summary: Crear un nuevo servicio bancario
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceName
 *               - serviceCode
 *               - serviceType
 *             properties:
 *               serviceName:
 *                 type: string
 *                 example: "Pago de Energía"
 *               serviceCode:
 *                 type: string
 *                 example: "ENERGY001"
 *               serviceType:
 *                 type: string
 *                 enum: [DEPOSIT, TRANSFER, PAYMENT, WITHDRAWAL, BALANCE_INQUIRY]
 *                 example: "PAYMENT"
 *               description:
 *                 type: string
 *                 example: "Pago de servicio eléctrico"
 *               transactionFee:
 *                 type: number
 *                 example: 5
 *               currency:
 *                 type: string
 *                 enum: [GTQ, USD]
 *                 example: "GTQ"
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   type: object
 *                   properties:
 *                     serviceName:
 *                       type: string
 *                     serviceCode:
 *                       type: string
 *                     serviceType:
 *                       type: string
 *                     description:
 *                       type: string
 *                     transactionFee:
 *                       type: number
 *                     currency:
 *                       type: string
 *       400:
 *         description: Error en la validación de los datos
 *       403:
 *         description: No tienes permisos para crear servicios bancarios
 */
router.post(
    '/',
    validateCreateFieldService,
    createFieldService
);

export default router;