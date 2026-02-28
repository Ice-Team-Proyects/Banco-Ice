import { Schema, model } from 'mongoose';

const exchangeRateSchema = Schema({
    currencyCode: {
        type: String,
        required: [true, 'El código de la moneda es obligatorio'],
        uppercase: true,
        unique: true 
    },
    currencyName: {
        type: String,
        required: [true, 'El nombre de la moneda es obligatorio'] 
    },
    buyRate: {
        type: Number,
        required: [true, 'La tasa de compra es obligatoria'] 
    },
    sellRate: {
        type: Number,
        required: [true, 'La tasa de venta es obligatoria'] 
    },
    effectiveDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('ExchangeRate', exchangeRateSchema);
