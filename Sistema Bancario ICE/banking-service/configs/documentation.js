'use strict'

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Sistema Bancario ICE API",
            version: "1.0.0",
            description: "API oficial para la gestión de servicios bancarios, transacciones y cuentas.",
            contact: {
                name: "ICE Banking Team"
            }
        },
        servers: [
            {
                url: "http://localhost:3050/BankingService/v1",
                description: "Servidor Local"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        security: [
            {
                bearerAuth: []
            }
        ],

        tags: [
            { name: "Accounts", description: "Gestión de cuentas bancarias" },
            { name: "Transactions", description: "Operaciones de depósitos, retiros y transferencias" },
            { name: "Services", description: "Servicios adicionales del banco" },
            { name: "Health", description: "Estado del servidor" }
        ]
    },

    apis: ["./src/**/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };