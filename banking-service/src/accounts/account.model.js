'use strict';

import { Schema, model } from 'mongoose';

const accountSchema = new Schema(
    {
        accountNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        accountType: {
            type: String,
            required: true,
            enum: {
                values: ['SAVINGS', 'CHECKING'],
                message: 'Tipo de cuenta no válido',
            },
        },

        ownerName: {
            type: String,
            required: [true, 'El nombre del titular es requerido'],
            trim: true,
            maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        },

        ownerDPI: {
            type: String,
            required: [true, 'El DPI del titular es requerido'],
            trim: true,
        },

        userId: {
            type: String,
            required: false,
            trim: true,
        }, 

        balance: {
            type: Number,
            default: 0,
            min: [0, 'El saldo no puede ser negativo'],
        },

        currency: {
            type: String,
            default: 'GTQ',
            enum: ['GTQ', 'USD'],
        },

        dailyLimit: {
            type: Number,
            default: 10000,
            min: [0, 'El límite diario no puede ser negativo'],
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

accountSchema.index({ isActive: 1 });
accountSchema.index({ userId: 1 });

export default model('Account', accountSchema);