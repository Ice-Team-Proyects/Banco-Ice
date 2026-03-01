'use strict';

import { Schema, model } from 'mongoose';

const transactionSchema = new Schema(
    {
        transactionCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        transactionType: {
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
                message: 'Tipo de transacción no válido',
            },
        },

        status: {
            type: String,
            required: true,
            default: 'PENDING',
            enum: {
                values: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
                message: 'Estado de transacción no válido',
            },
        },

        amount: {
            type: Number,
            required: [true, 'El monto es requerido'],
            min: [0.01, 'El monto debe ser mayor a 0'],
        },

        currency: {
            type: String,
            default: 'GTQ',
            enum: ['GTQ', 'USD'],
        },

        sourceAccount: {
            type: String,
            trim: true,
        },

        destinationAccount: {
            type: String,
            trim: true,
        },

        externalReference: {
            type: String,
            trim: true,
            maxLength: [100, 'La referencia externa no puede exceder 100 caracteres'],
        },

        description: {
            type: String,
            trim: true,
            maxLength: [300, 'La descripción no puede exceder 300 caracteres'],
        },

        fieldService: {
            type: Schema.Types.ObjectId,
            ref: 'FieldService',
            required: [true, 'El servicio bancario es requerido'],
        },

        transactionDate: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
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

transactionSchema.index({ transactionType: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ sourceAccount: 1 });
transactionSchema.index({ destinationAccount: 1 });

export default model('Transaction', transactionSchema);
