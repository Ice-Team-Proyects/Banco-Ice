# Banco-Ice
Banco-Ice es un sistema bancario diseñado para operar como una banca en linea moderna.

# 📌 Índice
1. 📖 Descripción General
2. 🎯 Objetivos del Proyecto
3. 🛠️ Stack Tecnológico
4. 🔐 Funcionalidades Principales
5. 🧩 Arquitectura del Sistema
6. 🧱 Microservicios Propuestos
7. 🔄 Metodología de Trabajo (SCRUM)
8. 👥 Equipo de Trabajo
9. 📌 Conclusión

# 📖Descripción General
El sistema bancario, es un sistema financiero digital diseñado para operar como una banca en linea para agilizar las operaciones bancarias de los usuarios permitiendo hacer depositos, transferencias, cambio de divisas, creación de cuentas bancarios de distinto tipo como de ahorro o monetaria, mantener un historial de las transacciones.

El objetivo es simplificar servicios que normalmente se hacen en persona en una forma intuitiva para el usuario por medio de nuestro programa

# 🎯Objetivos del proyecto
* Implementar un sistema de autenticación y roles seguro
* Manejar el sistema bancario desde una plataforma.
* Digitalizar transacciones, depositos, y historiales
* Optimizar el manejo del flujo del dinero
* Proporcionar cambios de divisas y creación de distintos tipos de cuentas bancarias

# 🛠️ Stack Tecnológico
## Backend
* ASP.NET Core 8.0
* JWT (JSON Web Token)
* Swagger 
* C#
* Node.Js

## Base de Datos
* PostgreSQL
* MongoDB

## Infraestructura
* Docker Desktop
* Docker

## Gestión y Control
* GitHub 
* Trello
* Postman
* pgAdmin 4

# 🔐Funcionalidades Principales
- Auntenticación y Roles
* Registro de usuarios
* Inicio de sesión
* Autenticación con JWT
* Gestión de roles:
    - Administrador
    - Usuario

- Gestión de cuentas Bancarias
* Creación de cuentas bancarias
* Consulta de saldo
* Actualización de datos de cuenta
* Activación / desactivación de cuentas
* Visualización de cuentas asociadas al usuario

- Gestión de transacciones
* Depósitos
* Transferencias entre cuentas
* Validación de fondos disponibles
* Registro automático de movimientos
* Historial de transacciones

- Productos y Divisas
* Tipos de cuentas (ahorro, monetaria, etc)
* Conversión de divisas
* Gestión de tasas de cambio
* Cálculo automático según tipo de cambio

- Reportes y control (Administrador)
* Reporte de transacciones por período
* Movimientos por usuario
* Control de cuentas activas
* Supervisión de operaciones
* Estadísticas general del sistema

# 🧩Arquitectura del Sistema
El proyecto usa una arquitectura de microservicios 
* Domain 
* Application
* Persistence
* API

## Justificación 
* Escabilidad independiente
* Desarrollo paralelo
* Fallas aisladas
* Despliegue independiente
* Responsabilidad por servicio

# 🧱Microservicios Propuestos
** Auth Service ** Usuarios, roles, autenticación JWT

** Account Service** CRUD creación de cuentas, consulta de saldos, tipos de cuentas, asociación de cuentas a usuarios

** Transacciones Service** Depósitos, transferencias, registro de movimientos, historial de transacciones

** Currency & Products Service** Gestión de tipos de cuentas, conversión de divisas, administración de tasas de cambio, Cálculo automático según 

** Report Service** Reportes de trasacciones por período, movimientos por usuario, control de cuentas activas, estadísticas generales del sistema, supervisión administrativa

# 🔄Metodología SCRUM
* Duración total: 24 semanas
* Sprints: 8
* Duración por Sprint: 3 semanas
## Ceremonias SCRUM
* Sprint Planning
* Daily Scrum
* Sprint Review
* Sprint Retrospective

# 👥Equipo de Trabajo
## Product Owner
* Rigoberto Godinez Fajardo
## Scrum Master
* Kenet Efraín Cuyuch Joj
## Development Team
* Carlos Emilio Navarro Sifontes
* Carlos Enrique Lopez Quino
* Carlos Alejandro Patal Choc

# 📌Conclusión 
Este proyecto representa la implementación de un Sistema Bancario Digital diseñado bajo principios de seguridad, escalabilidad y arquitectura modular, aplicando la metodología ágil SCRUM para garantizar un desarrollo iterativo y eficiente.

El enfoque basado en microservicios permite una mejor organización de los componentes del sistema, asegurando la correcta gestión de autenticación, cuentas bancarias, transacciones y divisas. Además, el uso de tecnologías modernas y buenas prácticas de desarrollo garantiza la integridad de la información, la seguridad en las operaciones financieras y la facilidad de mantenimiento y crecimiento futuro del sistema.