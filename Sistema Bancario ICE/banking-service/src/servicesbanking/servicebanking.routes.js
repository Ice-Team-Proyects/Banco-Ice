'use strict';

import { Router } from 'express';
import {
    createFieldService,
    getFieldServices
} from './servicebanking.controller.js';

import { validateCreateFieldService } from '../../middlewares/field-service-validator.js';

const router = Router();

router.get(
    '/',
    getFieldServices
);

router.post(
    '/',
    validateCreateFieldService,
    createFieldService
);

router.get
('/', getFieldServices);

export default router;
