'use strict';

import {
    createTransactionRecord,
    fetchTransactions,
    updateTransactionStatus,
} from './transaction.service.js';

export const createTransaction = async (req, res) => {
    try {
        const transaction = await createTransactionRecord({
            transactionData: req.body,
        });

        res.status(201).json({
            success: true,
            message: 'Transacción creada exitosamente',
            data: transaction,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la transacción',
            error: err.message,
        });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            transactionType,
            sourceAccount,
            destinationAccount,
            startDate,
            endDate,
        } = req.query;

        const { transactions, pagination } = await fetchTransactions({
            page,
            limit,
            status,
            transactionType,
            sourceAccount,
            destinationAccount,
            startDate,
            endDate,
        });

        res.status(200).json({
            success: true,
            message: 'Transacciones listadas exitosamente',
            data: transactions,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar las transacciones',
            error: err.message,
        });
    }
};

export const patchTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const transaction = await updateTransactionStatus({
            transactionId: id,
            status,
        });

        res.status(200).json({
            success: true,
            message: 'Estado de transacción actualizado exitosamente',
            data: transaction,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado de la transacción',
            error: err.message,
        });
    }
};
