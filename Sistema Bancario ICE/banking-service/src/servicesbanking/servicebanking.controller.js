'use strict';

import {
    createFieldServiceRecord,
    fetchFieldServices
} from './servicebanking.service.js';

export const createFieldService = async (req, res) => {
    try {
        const service = await createFieldServiceRecord({
            serviceData: req.body,
        });

        res.status(201).json({
            success: true,
            message: 'Servicio bancario creado exitosamente',
            data: service,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el servicio bancario',
            error: err.message,
        });
    }
};

export const getFieldServices = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            isActive = true,
            serviceType,
        } = req.query;

        const { services, pagination } = await fetchFieldServices({
            page,
            limit,
            isActive,
            serviceType,
        });

        res.status(200).json({
            success: true,
            message: 'Servicios bancarios listados exitosamente',
            data: services,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar los servicios bancarios',
            error: err.message,
        });
    }
};
