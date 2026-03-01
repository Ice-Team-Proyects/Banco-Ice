'use strict'

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { dbConnection } from './db.js';
import { corsOptions } from './cors.configuration.js'
import { helmetOptions } from './helmet.configuration.js'
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import servicesbankingRoutes from '../src/servicesbanking/servicebanking.routes.js';
import transactionRoutes from '../src/transactions/transaction.routes.js';
import accountRoutes from '../src/accounts/account.routes.js';

const BASE_PATH = '/BankingService/v1'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
};

const routes = (app) => {
    app.use(`${BASE_PATH}/servicesbanking`, servicesbankingRoutes);
    app.use(`${BASE_PATH}/transactions`, transactionRoutes);
    app.use(`${BASE_PATH}/accounts`, accountRoutes);

    app.use(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'Banking Service Admin Server'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Ruta no existe en el servidor'
        });
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        await dbConnection();
        routes(app);
        app.listen(PORT, () => {
            console.log(`Banco Ice admin server running on port ${PORT}`);
            console.log(`Health check http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (err) {
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};
