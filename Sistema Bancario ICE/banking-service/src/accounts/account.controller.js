'use strict';

import {
    createAccountRecord,
    fetchAccounts,
    processDeposit,
    processTransfer,
    processPayment,
    processWithdrawal,
    fetchAccountBalance,
} from './account.service.js';

export const createAccount = async (req, res) => {
    try {
        const account = await createAccountRecord({
            accountData: {
                ...req.body,
                userId: req.user.id,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Cuenta bancaria creada exitosamente',
            data: account,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la cuenta bancaria',
            error: err.message,
        });
    }
};

export const getAccounts = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para listar las cuentas bancarias',
            });
        }

        const {
            page = 1,
            limit = 10,
            isActive = true,
            accountType,
        } = req.query;

        const { accounts, pagination } = await fetchAccounts({
            page,
            limit,
            isActive,
            accountType,
        });

        res.status(200).json({
            success: true,
            message: 'Cuentas bancarias listadas exitosamente',
            data: accounts,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar las cuentas bancarias',
            error: err.message,
        });
    }
};

export const deposit = async (req, res) => {
    try {
        const { accountNumber, amount, fieldService, description } = req.body;

        const result = await processDeposit({
            accountNumber,
            amount,
            fieldService,
            description,
        });

        res.status(200).json({
            success: true,
            message: 'Depósito realizado exitosamente',
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al realizar el depósito',
            error: err.message,
        });
    }
};

export const transfer = async (req, res) => {
    try {
        const { sourceAccountNumber, destinationAccountNumber, amount, fieldService, description } = req.body;

        const result = await processTransfer({
            sourceAccountNumber,
            destinationAccountNumber,
            amount,
            fieldService,
            description,
        });

        res.status(200).json({
            success: true,
            message: 'Transferencia realizada exitosamente',
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al realizar la transferencia',
            error: err.message,
        });
    }
};

export const payment = async (req, res) => {
    try {
        const { sourceAccountNumber, amount, fieldService, externalReference, description } = req.body;

        const result = await processPayment({
            sourceAccountNumber,
            amount,
            fieldService,
            externalReference,
            description,
        });

        res.status(200).json({
            success: true,
            message: 'Pago de servicio realizado exitosamente',
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al realizar el pago',
            error: err.message,
        });
    }
};

export const withdrawal = async (req, res) => {
    try {
        const { sourceAccountNumber, amount, fieldService, description } = req.body;

        const result = await processWithdrawal({
            sourceAccountNumber,
            amount,
            fieldService,
            description,
        });

        res.status(200).json({
            success: true,
            message: 'Retiro realizado exitosamente',
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al realizar el retiro',
            error: err.message,
        });
    }
};

export const getBalance = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { fieldService } = req.query;

        const result = await fetchAccountBalance({ accountNumber, fieldService });

        res.status(200).json({
            success: true,
            message: 'Consulta de saldo exitosa',
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al consultar el saldo',
            error: err.message,
        });
    }
};