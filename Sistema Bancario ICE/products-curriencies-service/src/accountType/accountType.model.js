import { Schema, model } from 'mongoose';

const accountTypeSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del tipo de cuenta es obligatorio'],
        unique: true,
        uppercase: true 
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    currency: {
        type: String,
        enum: ['GTQ', 'USD', 'EUR'], 
        required: [true, 'La moneda base es obligatoria'],
        default: 'GTQ'
    },
    interestRate: {
        type: Number,
        default: 0.0 
    },
    minOpeningBalance: {
        type: Number,
        required: [true, 'El saldo mínimo de apertura es obligatorio']
    },
    monthlyFee: {
        type: Number,
        default: 0.0 
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('AccountType', accountTypeSchema);