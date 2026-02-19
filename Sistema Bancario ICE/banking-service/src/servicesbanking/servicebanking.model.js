'use strict';

import { Schema, model } from 'mongoose';

const fieldServiceSchema = new Schema(
    {
        serviceName: {
            type: String,
            required: [true, 'El nombre del servicio es requerido'],
            trim: true,
            maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        },

        serviceCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        serviceType: {
            type: String,
            required: true,
            enum: {
                values: [
                    'DEPOSIT',
                    'TRANSFER',
                    'PAYMENT',
                    'WITHDRAWAL',
                    'BALANCE_INQUIRY',
                ],
                message: 'Tipo de servicio no válido',
            },
        },

        description: {
            type: String,
            trim: true,
            maxLength: [300, 'La descripción no puede exceder 300 caracteres'],
        },

        transactionFee: {
            type: Number,
            default: 0,
            min: [0, 'La comisión no puede ser negativa'],
        },

        currency: {
            type: String,
            default: 'GTQ',
            enum: ['GTQ', 'USD'],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

fieldServiceSchema.index({ serviceType: 1 });
fieldServiceSchema.index({ isActive: 1 });

export default model('FieldService', fieldServiceSchema);
