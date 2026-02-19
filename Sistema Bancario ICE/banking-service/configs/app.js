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

const BASE_PATH = '/BankingService/v1'

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false, limit: '10mb'})); //esto es para poder procesar formularios de html principalmente desde su forma mas base
    app.use(express.json({limit: '10mb'})); //esto es para procesar json
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
}; //aqui se cargan los middlewares por defecto, son globales , los que rigen toda el api durante su tiempo de vida

const routes = (app) => {
    app.use(`${BASE_PATH}/servicesbanking`, servicesbankingRoutes);
    app.use(`${BASE_PATH}/servicesbanking`, servicesbankingRoutes);
    app.use(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'Banking Service Admin Server'
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            succes: false,
            message: 'Ruta no existe en el servidor'
        })
    })
}

//creamos la funcion que arranque el servidor
export const initServer = async() => {
    const app = express();
    const PORT = process.env.PORT //variable de entorno donde tengo el puerto
    app.set('trust proxy', 1);

    try{
        middlewares(app);
        await dbConnection();
        routes(app);
        app.listen(PORT, () => {
            console.log(`Banco Ice admin server running on port ${PORT}`);
            console.log(`Health check http://localhost:${PORT}${BASE_PATH}/health`);
        });
    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`)
        process.exit(1);
    }

}