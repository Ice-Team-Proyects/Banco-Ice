'use strict';

import FieldService from './servicebanking.model.js';

export const createFieldServiceRecord = async ({ serviceData }) => {
    const data = { ...serviceData };

    const service = new FieldService(data);
    await service.save();

    return service;
};

export const fetchFieldServices = async ({
    page = 1,
    limit = 10,
    isActive = true,
    serviceType,
}) => {
    const filter = { isActive };

    if (serviceType) {
        filter.serviceType = serviceType;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const services = await FieldService.find(filter)
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await FieldService.countDocuments(filter);

    return {
        services,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};
