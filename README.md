# SmartLogix – Plataforma Inteligente de Gestión Logística eCommerce

## Descripción del Proyecto

SmartLogix es una plataforma logística orientada a pequeñas y medianas empresas de eCommerce que permite gestionar inventarios, pedidos y envíos mediante una arquitectura basada en microservicios. El objetivo del sistema es mejorar la eficiencia operativa, automatizar procesos logísticos y permitir la escalabilidad del sistema.

Este proyecto se desarrolla como caso semestral de la asignatura **Desarrollo Fullstack III**.

---

## Arquitectura del Sistema

El sistema está basado en una arquitectura de microservicios, utilizando un API Gateway y un Backend for Frontend (BFF) para la comunicación entre el frontend y los servicios backend.

### Microservicios principales

* API Gateway
* Backend For Frontend (BFF)
* Inventory Service (Gestión de inventario)
* Order Service (Gestión de pedidos)
* Shipping Service (Gestión de envíos)
* Auth Service (Autenticación)

### Arquitectura general

```
Frontend
   |
   v
API Gateway
   |
   v
Backend For Frontend (BFF)
   |
   |---- Inventory Service ---- Inventory DB
   |---- Order Service -------- Orders DB
   |---- Shipping Service ----- Shipping DB
```

---

## Tecnologías Utilizadas

### Frontend

* React 
* HTML
* CSS
* JavaScript
* NPM

### Backend

* Java
* Spring Boot
* Maven
* JPA / Hibernate
* REST API

### Base de Datos

* MySQL / PostgreSQL

### DevOps

* Git
* GitHub
* Docker
* GitHub Actions
* SonarQube
* JUnit (Pruebas Unitarias)

---

## Patrones de Diseño Implementados

* API Gateway Pattern
* Backend For Frontend Pattern
* Repository Pattern
* Factory Method Pattern
* Circuit Breaker Pattern
* DTO Pattern
* Database per Service Pattern

---

## Estructura del Proyecto

```
smartlogix/
│
├── api-gateway/
├── bff-service/
├── inventory-service/
├── order-service/
├── shipping-service/
├── frontend/
├── database/
├── docs/
└── README.md
```

---

## Instalación y Ejecución

### Clonar repositorio

```
git clone https://github.com/tu-usuario/smartlogix.git
```

### Entrar al proyecto

```
cd smartlogix
```

### Ejecutar microservicios

```
mvn spring-boot:run
```

### Ejecutar frontend

```
npm install
npm start
```
## SmartLogix
---

## Pruebas Unitarias

Para ejecutar las pruebas:

```
mvn test
```

La cobertura de código se valida mediante SonarQube, con un mínimo requerido del 60%.

---

## Integración Continua

El proyecto utiliza GitHub Actions para:

* Build automático
* Ejecución de pruebas
* Análisis de código
* Control de calidad

---

## Autores

* Vicente Oyrazún Solis
* Tomás López Fuenzalida
* Samuel Pérez Reyes

---

## Licencia

Este proyecto es desarrollado con fines académicos.
