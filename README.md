# Banco_ICE

Banco_ICE es un sistema de gestión bancaria desarrollado en Node.js con
Express, estructurado por módulos y preparado para trabajar con
PostgreSQL mediante Docker.

------------------------------------------------------------------------

## Índice

-   Descripción General\
-   Objetivos del Proyecto\
-   Stack Tecnológico\
-   Funcionalidades Principales\
-   Arquitectura del Sistema\
-   Módulos del Sistema\
-   Metodología SCRUM\
-   Equipo de Trabajo\
-   Conclusión

------------------------------------------------------------------------

## Descripción General

Banco_ICE es una plataforma backend diseñada para gestionar:

-   Administración de cuentas
-   Gestión de servicios bancarios
-   Registro y control de transacciones

El sistema está construido bajo una arquitectura modular basada en
servicios, permitiendo escalabilidad, mantenibilidad y separación clara
de responsabilidades.

------------------------------------------------------------------------

## Objetivos del Proyecto

-   Centralizar la gestión de cuentas bancarias.
-   Administrar servicios financieros ofrecidos por el banco.
-   Registrar y controlar transacciones de forma segura.
-   Implementar una arquitectura organizada y escalable.
-   Aplicar buenas prácticas de desarrollo backend.
-   Trabajar bajo metodología ágil SCRUM.

------------------------------------------------------------------------

## Stack Tecnológico

### Backend

-   Node.js
-   Express.js
-   JavaScript (ES Modules)
-   UUID
-   Validator

### Base de Datos

-   PostgreSQL
-   Docker Compose

### Infraestructura

-   Docker
-   Docker Compose

### Gestión y Control

-   GitHub
-   Postman
-   Trello
-   pgAdmin

------------------------------------------------------------------------

## Funcionalidades Principales

### Gestión de Cuentas

-   Crear cuentas bancarias
-   Consultar cuentas
-   Actualizar información de cuentas
-   Gestión del estado de cuenta

### Servicios Bancarios

-   Registro de servicios financieros
-   Asociación de servicios a cuentas
-   Administración de tipos de servicio

### Transacciones

-   Registro de transacciones
-   Control de movimientos
-   Historial de operaciones
-   Validación de datos antes de ejecutar movimientos

------------------------------------------------------------------------

## Arquitectura del Sistema

Estructura del proyecto:

src/ ├── accounts/ ├── servicesbanking/ └── transactions/

Cada módulo contiene:

-   controller → Manejo de solicitudes HTTP
-   service → Lógica de negocio
-   model → Definición de estructura de datos
-   routes → Definición de endpoints

------------------------------------------------------------------------

## Módulos del Sistema

### Accounts Module

-   account.controller.js
-   account.service.js
-   account.model.js
-   account.routes.js

### ServicesBanking Module

-   servicebanking.controller.js
-   servicebanking.service.js
-   servicebanking.model.js
-   servicebanking.routes.js

### Transactions Module

-   transaction.controller.js
-   transaction.service.js
-   transaction.model.js
-   transaction.routes.js

### Postgre_DB

-   docker-compose.yml

------------------------------------------------------------------------

## Metodología SCRUM

Duración total estimada: 16--24 semanas\
Sprints: 6--8\
Duración por Sprint: 2--3 semanas

### Ceremonias SCRUM

-   Sprint Planning
-   Daily Scrum
-   Sprint Review
-   Sprint Retrospective
-   Product Backlog Refinement

------------------------------------------------------------------------

## Equipo de Trabajo

### Product Owner

Rigoberto Godínez Fajardo

### Scrum Master

Kenet Efraín Kuyuch Joj

### Development Team

Carlos López Quino
Carlos Alejandro Patal Choc
Carlos Emilio Navarro Sifontes

------------------------------------------------------------------------

## Conclusión

Banco_ICE representa una implementación estructurada de un sistema
bancario backend moderno, aplicando arquitectura modular, buenas
prácticas en Node.js, integración con PostgreSQL, contenedorización con
Docker y metodología ágil SCRUM.

El proyecto está preparado para evolucionar hacia una arquitectura de
microservicios y escalar a un entorno empresarial real.

------------------------------------------------------------------------

# DOCUMENTACION DE ENDPOINTS - SISTEMA BANCARIO BANCO ICE

Este documento detalla todas las rutas de la API para el funcionamiento del banco, sus requerimientos de autenticacion y las estructuras de datos esperadas (JSON).

---

## 1. AUTENTICACION (AUTH)

Rutas encargadas del registro y acceso de los clientes al sistema.

### Registrarse
* **Metodo y Ruta:** `POST http://localhost:5227/api/v1/auth/register`
* **Autenticacion:** No requiere token.

### Verificar Email
* **Metodo y Ruta:** `POST http://localhost:5227/api/v1/auth/verify-email`
* **Autenticacion:** No requiere token.

### Login (Iniciar Sesion)
* **Metodo y Ruta:** `POST http://localhost:5210/api/v1/auth/login`
* **Autenticacion:** No requiere token.

---

## 2. ESTADO DEL SISTEMA

### Comprobar Servicio Bancario
* **Metodo y Ruta:** `GET http://localhost:3050/BankingService/v1/health`
* **Autenticacion:** No requiere token.

---

## 3. SERVICIOS BANCARIOS

Gestion de los servicios disponibles (Retiros, Pagos, etc.).

### Crear un Servicio
* **Metodo y Ruta:** `POST http://localhost:3050/BankingService/v1/servicesbanking`
* **Autenticacion:** REQUIERE TOKEN.

**Body Request (JSON):**
```json
{
  "serviceName": "Retiros",
  "serviceCode": "R-001",
  "serviceType": "WITHDRAWAL",
  "description": "Deposito en ventanilla",
  "transactionFee": 0,
  "currency": "GTQ"
}
Listar Servicios
Metodo y Ruta: GET http://localhost:3050/BankingService/v1/servicesbanking

Autenticacion: No requiere token.

4. CUENTAS BANCARIAS
Crear una Cuenta Bancaria
Metodo y Ruta: POST http://localhost:3050/BankingService/v1/accounts

Autenticacion: REQUIERE TOKEN.

Body Request (JSON):

JSON
{
  "accountType": "SAVINGS",
  "ownerName": "nombre_del_cliente",
  "ownerDPI": "numero_de_dpi",
  "currency": "GTQ",
  "dailyLimit": 10000
}
Listar Cuentas
Metodo y Ruta: GET http://localhost:3050/BankingService/v1/accounts

Autenticacion: No requiere token.

Ver Saldo de una Cuenta
Metodo y Ruta: GET http://localhost:3050/BankingService/v1/accounts/balance/NUMERODECUENTA

Autenticacion: No requiere token.

5. TRANSACCIONES
Hacer un Deposito
Metodo y Ruta: POST http://localhost:3050/BankingService/v1/accounts/deposit

Autenticacion: REQUIERE TOKEN.

Body Request (JSON):

JSON
{
  "accountNumber": "GTQ-numero_de_cuenta",
  "amount": 5000,
  "fieldService": "id_del_servicio",
  "description": "Deposito inicial"
}
Hacer un Retiro
Metodo y Ruta: POST http://localhost:3050/BankingService/v1/accounts/withdrawal

Autenticacion: REQUIERE TOKEN.

Body Request (JSON):

JSON
{
  "sourceAccountNumber": "GTQ-numero_de_cuenta",
  "amount": 1000,
  "fieldService": "id_del_servicio",
  "description": "Retiro en cajero"
}
Hacer una Transferencia
Metodo y Ruta: POST http://localhost:3050/BankingService/v1/accounts/transfer

Autenticacion: REQUIERE TOKEN.

Body Request (JSON):

JSON
{
  "sourceAccountNumber": "GTQ-cuenta_origen",
  "destinationAccountNumber": "GTQ-cuenta_destino",
  "amount": 1000,
  "fieldService": "id_del_servicio",
  "description": "Pago de prestamo"
}
Pago de Servicios (Agua, Luz, etc.)
Metodo y Ruta: POST http://localhost:3050/BankingService/v1/accounts/payment

Autenticacion: REQUIERE TOKEN.

Body Request (JSON):

JSON
{
  "sourceAccountNumber": "GTQ-numero_de_cuenta",
  "amount": 500,
  "fieldService": "id_del_servicio",
  "externalReference": "referencia_del_recibo",
  "description": "Pago agua febrero"
}