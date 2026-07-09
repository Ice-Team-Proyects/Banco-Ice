'use strict';

import Transaction from './transaction.model.js';

export const createTransactionRecord = async ({ transactionData, user }) => {
    const data = { ...transactionData };

    if (!data.transactionCode) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
        data.transactionCode = `TXN-${timestamp}-${random}`;
    }

    if (user) {
        data.user = user;
    }

    const transaction = new Transaction(data);
    await transaction.save();

    return transaction;
};

export const fetchTransactions = async ({
    page = 1,
    limit = 10,
    status,
    transactionType,
    sourceAccount,
    destinationAccount,
    startDate,
    endDate,

    userAccounts
}) => {
    const filter = { isActive: true };

    if (status) filter.status = status;
    if (transactionType) filter.transactionType = transactionType;
    if (sourceAccount) filter.sourceAccount = sourceAccount;
    if (destinationAccount) filter.destinationAccount = destinationAccount;

    if (startDate || endDate) {
        filter.transactionDate = {};
        if (startDate) filter.transactionDate.$gte = new Date(startDate);
        if (endDate) filter.transactionDate.$lte = new Date(endDate);
    }

    if (userAccounts && userAccounts.length > 0) {
        filter.$or = [
            { sourceAccount: { $in: userAccounts } },
            { destinationAccount: { $in: userAccounts } }
        ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const transactions = await Transaction.find(filter)
        .populate('fieldService', 'serviceName serviceCode serviceType')
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ transactionDate: -1 });

    const total = await Transaction.countDocuments(filter);

    return {
        transactions,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const updateTransactionStatus = async ({ transactionId, status }) => {
    const updateData = { status };

    if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
    }

    const transaction = await Transaction.findByIdAndUpdate(
        transactionId,
        updateData,
        { new: true }
    ).populate('fieldService', 'serviceName serviceCode serviceType');

    if (!transaction) {
        throw new Error('Transacción no encontrada');
    }

    return transaction;
};