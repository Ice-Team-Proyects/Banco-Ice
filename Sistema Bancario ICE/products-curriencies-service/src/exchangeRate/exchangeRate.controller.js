import ExchangeRate from './exchangeRate.model.js';

export const createExchangeRate = async (req, res) => {
    try {
        const data = req.body;
        const newRate = new ExchangeRate(data);
        await newRate.save();
        return res.status(201).send({ message: 'Tasa de cambio registrada', exchangeRate: newRate });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al registrar la tasa de cambio', error: err.message });
    }
};

export const getExchangeRates = async (req, res) => {
    try {
        const rates = await ExchangeRate.find({ status: true });
        return res.status(200).send({ rates });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener las tasas de cambio' });
    }
};

export const updateExchangeRate = async (req, res) => {
    try {
        const { id } = req.params;
        // Al actualizar, actualizamos la fecha de vigencia automáticamente
        const data = { ...req.body, effectiveDate: Date.now() }; 
        
        const updatedRate = await ExchangeRate.findByIdAndUpdate(id, data, { new: true });
        if (!updatedRate) return res.status(404).send({ message: 'Tasa de cambio no encontrada' });

        return res.status(200).send({ message: 'Tasa de cambio actualizada', exchangeRate: updatedRate });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar la tasa' });
    }
};


export const convertCurrency = async (req, res) => {
    try {
        let { amount, fromCurrency, toCurrency } = req.body;
        
        fromCurrency = fromCurrency.toUpperCase();
        toCurrency = toCurrency.toUpperCase();

        if (fromCurrency === toCurrency) {
            return res.status(200).send({ convertedAmount: amount, rateApplied: 1 });
        }

        let convertedAmount = 0;
        let rateApplied = 0;

        // Caso 1: Venta de divisas (El usuario tiene GTQ y quiere USD/EUR)
        // El banco VENDE la moneda extranjera al usuario a la tasa de Venta (SellRate)
        if (fromCurrency === 'GTQ') {
            const rateDoc = await ExchangeRate.findOne({ currencyCode: toCurrency, status: true });
            if (!rateDoc) return res.status(404).send({ message: `No hay tasa de cambio para ${toCurrency}` });
            
            rateApplied = rateDoc.sellRate;
            convertedAmount = amount / rateApplied; 
        } 
        // Caso 2: Compra de divisas (El usuario tiene USD/EUR y quiere GTQ)
        // El banco COMPRA la moneda extranjera al usuario a la tasa de Compra (BuyRate)
        else if (toCurrency === 'GTQ') {
            const rateDoc = await ExchangeRate.findOne({ currencyCode: fromCurrency, status: true });
            if (!rateDoc) return res.status(404).send({ message: `No hay tasa de cambio para ${fromCurrency}` });
            
            rateApplied = rateDoc.buyRate;
            convertedAmount = amount * rateApplied;
        } 
        // Caso 3: Moneda extranjera a Moneda extranjera (Ej: USD a EUR)
        // Convertimos USD a GTQ (Banco compra) y luego GTQ a EUR (Banco vende)
        else {
            const fromRateDoc = await ExchangeRate.findOne({ currencyCode: fromCurrency, status: true });
            const toRateDoc = await ExchangeRate.findOne({ currencyCode: toCurrency, status: true });

            if (!fromRateDoc || !toRateDoc) {
                return res.status(404).send({ message: 'Tasas de cambio no encontradas para la conversión cruzada' });
            }

            const amountInGTQ = amount * fromRateDoc.buyRate;
            convertedAmount = amountInGTQ / toRateDoc.sellRate;
            rateApplied = `Cruzada: Compra ${fromCurrency} a ${fromRateDoc.buyRate}, Venta ${toCurrency} a ${toRateDoc.sellRate}`;
        }

        return res.status(200).send({
            originalAmount: amount,
            fromCurrency,
            toCurrency,
            convertedAmount: Number(convertedAmount.toFixed(2)), 
            rateApplied
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error interno al calcular la conversión', error: err.message });
    }
};