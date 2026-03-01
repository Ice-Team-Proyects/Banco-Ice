'use strict';

import Account from './account.model.js';
import Transaction from '../transactions/transaction.model.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateTransactionCode = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN-${timestamp}-${random}`;
};

const generateAccountNumber = () => {
    const random = Math.floor(Math.random() * 9000000000 + 1000000000);
    return `GTQ-${random}`;
};

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const getDailySpent = async (accountNumber) => {
    const { start, end } = getTodayRange();

    const result = await Transaction.aggregate([
        {
            $match: {
                sourceAccount: accountNumber,
                status: 'COMPLETED',
                transactionDate: { $gte: start, $lte: end },
                transactionType: { $in: ['TRANSFER', 'PAYMENT', 'WITHDRAWAL'] },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' },
            },
        },
    ]);

    return result.length > 0 ? result[0].total : 0;
};

// ─── Crear cuenta ────────────────────────────────────────────────────────────

export const createAccountRecord = async ({ accountData }) => {
    const data = { ...accountData };

    if (!data.accountNumber) {
        data.accountNumber = generateAccountNumber();
    }

    const account = new Account(data);
    await account.save();

    return account;
};

// ─── Listar cuentas ──────────────────────────────────────────────────────────

export const fetchAccounts = async ({
    page = 1,
    limit = 10,
    isActive = true,
    accountType,
}) => {
    const filter = { isActive };

    if (accountType) {
        filter.accountType = accountType;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const accounts = await Account.find(filter)
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Account.countDocuments(filter);

    return {
        accounts,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

// ─── Depósito ────────────────────────────────────────────────────────────────

export const processDeposit = async ({ accountNumber, amount, fieldService, description }) => {
    const account = await Account.findOne({ accountNumber, isActive: true });

    if (!account) throw new Error('Cuenta destino no encontrada o inactiva');

    account.balance += amount;
    await account.save();

    const transaction = new Transaction({
        transactionCode: generateTransactionCode(),
        transactionType: 'DEPOSIT',
        status: 'COMPLETED',
        amount,
        currency: account.currency,
        destinationAccount: accountNumber,
        fieldService,
        description: description || `Depósito a cuenta ${accountNumber}`,
        completedAt: new Date(),
    });

    await transaction.save();

    return { transaction, updatedBalance: account.balance };
};

// ─── Transferencia ───────────────────────────────────────────────────────────

export const processTransfer = async ({
    sourceAccountNumber,
    destinationAccountNumber,
    amount,
    fieldService,
    description,
}) => {
    const sourceAccount = await Account.findOne({ accountNumber: sourceAccountNumber, isActive: true });
    const destinationAccount = await Account.findOne({ accountNumber: destinationAccountNumber, isActive: true });

    if (!sourceAccount) throw new Error('Cuenta origen no encontrada o inactiva');
    if (!destinationAccount) throw new Error('Cuenta destino no encontrada o inactiva');
    if (sourceAccountNumber === destinationAccountNumber) throw new Error('Las cuentas origen y destino no pueden ser la misma');
    if (sourceAccount.balance < amount) throw new Error('Saldo insuficiente en la cuenta origen');

    const dailySpent = await getDailySpent(sourceAccountNumber);
    if (dailySpent + amount > sourceAccount.dailyLimit) {
        throw new Error(`Límite diario excedido. Disponible hoy: Q${sourceAccount.dailyLimit - dailySpent}`);
    }

    sourceAccount.balance -= amount;
    destinationAccount.balance += amount;

    await sourceAccount.save();
    await destinationAccount.save();

    const transaction = new Transaction({
        transactionCode: generateTransactionCode(),
        transactionType: 'TRANSFER',
        status: 'COMPLETED',
        amount,
        currency: sourceAccount.currency,
        sourceAccount: sourceAccountNumber,
        destinationAccount: destinationAccountNumber,
        fieldService,
        description: description || `Transferencia de ${sourceAccountNumber} a ${destinationAccountNumber}`,
        completedAt: new Date(),
    });

    await transaction.save();

    return {
        transaction,
        sourceBalance: sourceAccount.balance,
        destinationBalance: destinationAccount.balance,
    };
};

// ─── Pago de servicio ────────────────────────────────────────────────────────

export const processPayment = async ({
    sourceAccountNumber,
    amount,
    fieldService,
    externalReference,
    description,
}) => {
    const account = await Account.findOne({ accountNumber: sourceAccountNumber, isActive: true });

    if (!account) throw new Error('Cuenta no encontrada o inactiva');
    if (account.balance < amount) throw new Error('Saldo insuficiente para realizar el pago');

    const dailySpent = await getDailySpent(sourceAccountNumber);
    if (dailySpent + amount > account.dailyLimit) {
        throw new Error(`Límite diario excedido. Disponible hoy: Q${account.dailyLimit - dailySpent}`);
    }

    account.balance -= amount;
    await account.save();

    const transaction = new Transaction({
        transactionCode: generateTransactionCode(),
        transactionType: 'PAYMENT',
        status: 'COMPLETED',
        amount,
        currency: account.currency,
        sourceAccount: sourceAccountNumber,
        fieldService,
        externalReference,
        description: description || `Pago de servicio desde cuenta ${sourceAccountNumber}`,
        completedAt: new Date(),
    });

    await transaction.save();

    return { transaction, updatedBalance: account.balance };
};

// ─── Retiro ──────────────────────────────────────────────────────────────────

export const processWithdrawal = async ({
    sourceAccountNumber,
    amount,
    fieldService,
    description,
}) => {
    const account = await Account.findOne({ accountNumber: sourceAccountNumber, isActive: true });

    if (!account) throw new Error('Cuenta no encontrada o inactiva');
    if (account.balance < amount) throw new Error('Saldo insuficiente para realizar el retiro');

    const dailySpent = await getDailySpent(sourceAccountNumber);
    if (dailySpent + amount > account.dailyLimit) {
        throw new Error(`Límite diario excedido. Disponible hoy: Q${account.dailyLimit - dailySpent}`);
    }

    account.balance -= amount;
    await account.save();

    const transaction = new Transaction({
        transactionCode: generateTransactionCode(),
        transactionType: 'WITHDRAWAL',
        status: 'COMPLETED',
        amount,
        currency: account.currency,
        sourceAccount: sourceAccountNumber,
        fieldService,
        description: description || `Retiro desde cuenta ${sourceAccountNumber}`,
        completedAt: new Date(),
    });

    await transaction.save();

    return { transaction, updatedBalance: account.balance };
};

// ─── Consulta de saldo ───────────────────────────────────────────────────────

export const fetchAccountBalance = async ({ accountNumber, fieldService }) => {
    const account = await Account.findOne({ accountNumber, isActive: true });

    if (!account) throw new Error('Cuenta no encontrada o inactiva');

    if (fieldService) {
        const transaction = new Transaction({
            transactionCode: generateTransactionCode(),
            transactionType: 'BALANCE_INQUIRY',
            status: 'COMPLETED',
            amount: 0,
            currency: account.currency,
            sourceAccount: accountNumber,
            fieldService,
            description: `Consulta de saldo cuenta ${accountNumber}`,
            completedAt: new Date(),
        });

        await transaction.save();
    }

    return {
        accountNumber: account.accountNumber,
        ownerName: account.ownerName,
        balance: account.balance,
        currency: account.currency,
        accountType: account.accountType,
    };
};
