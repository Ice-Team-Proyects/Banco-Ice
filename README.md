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

Carlos López Quino

### Scrum Master

Carlos Emilio Navarro Sifontes

### Development Team

Kenet Efraín Kuyuch Joj\
Rigoberto Godínez Fajardo\
Carlos Alejandro Patal Choc

------------------------------------------------------------------------

## Conclusión

Banco_ICE representa una implementación estructurada de un sistema
bancario backend moderno, aplicando arquitectura modular, buenas
prácticas en Node.js, integración con PostgreSQL, contenedorización con
Docker y metodología ágil SCRUM.

El proyecto está preparado para evolucionar hacia una arquitectura de
microservicios y escalar a un entorno empresarial real.
