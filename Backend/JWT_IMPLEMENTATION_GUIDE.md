# 🔐 Guía de Implementación JWT - SmartLogix

## 📋 Tabla de Contenidos
1. [¿Qué es JWT?](#qué-es-jwt)
2. [Estructura de la Implementación](#estructura-de-la-implementación)
3. [Cómo Usar](#cómo-usar)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Probar con Postman](#probar-con-postman)
6. [Troubleshooting](#troubleshooting)

---

## ¿Qué es JWT?

**JWT (JSON Web Token)** es un estándar abierto (RFC 7519) para crear tokens de acceso seguros. Permite autenticación sin estado (stateless) entre el cliente y el servidor.

### Estructura: `Header.Payload.Signature`

```
eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJqdWFuIiwidXNlcklkIjoxLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MTY4MDA4NjQwMH0.
test123...
```

1. **Header**: Algoritmo y tipo de token
2. **Payload**: Datos del usuario (userId, username, companyId)
3. **Signature**: Firma criptográfica (verifica autenticidad)

---

## Estructura de la Implementación

### Archivos Creados

```
usuario/
├── src/main/java/com/smartlogix/usuario/
│   ├── util/
│   │   └── JwtUtil.java                 # 🔑 Generar y validar tokens
│   ├── filter/
│   │   └── JwtFilter.java               # 🛡️ Interceptar y validar JWT en requests
│   ├── config/
│   │   └── SecurityConfig.java          # ⚙️ Configuración de Spring Security
│   ├── service/
│   │   └── UserService.java (actualizado)
│   ├── dto/
│   │   └── LoginResponse.java (actualizado)
│   └── controller/
│       └── UserController.java
├── src/test/java/com/smartlogix/usuario/
│   └── service/
│       └── UserServiceJwtTest.java      # ✅ Tests para JWT
└── pom.xml (actualizado)
```

### Dependencias Agregadas

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

## Cómo Usar

### 1. Compilar el Proyecto

```bash
cd C:\...\Backend\usuario
mvn clean compile
```

### 2. Ejecutar Tests

```bash
mvn clean test
```

Deberías ver todos los tests de JWT pasando:
```
✅ testLoginSuccessfulGeneratesToken
✅ testLoginWithIncorrectPassword
✅ testLoginWithNonExistentUser
✅ testLoginWithoutCompany
✅ testTokenIsGeneratedOnlyAfterSuccessfulAuthentication
```

### 3. Ejecutar la Aplicación

```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080/api`

---

## Flujo de Autenticación

### 1️⃣ Login - Obtener Token

**Request:**
```
POST /api/users/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Exitoso):**
```json
{
  "userId": 1,
  "username": "admin",
  "companyId": 1,
  "companyName": "SmartLogix",
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "message": "Login exitoso"
}
```

**Response (Fallido):**
```json
{
  "userId": null,
  "username": null,
  "companyId": null,
  "companyName": null,
  "token": null,
  "message": "Usuario o contraseña incorrectos"
}
```

### 2️⃣ Usar Token en Requests

**Request a ruta protegida:**
```
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

**El filtro valida el token:**
- ✅ Si es válido: procesa la solicitud
- ❌ Si es expirado: retorna 401 Unauthorized
- ❌ Si es inválido: retorna 401 Unauthorized

### 3️⃣ Respuesta con Token Inválido

```json
{
  "error": "Token JWT inválido o expirado"
}
```

---

## Probar con Postman

### Paso 1: Hacer Login

1. Crear nueva solicitud `POST`
2. URL: `http://localhost:8080/api/users/login`
3. Headers: `Content-Type: application/json`
4. Body (raw):
```json
{
  "username": "admin",
  "password": "admin123"
}
```
5. Enviar
6. **Copiar el valor de `token` de la respuesta**

### Paso 2: Usar Token en Solicitudes Protegidas

1. Crear nueva solicitud `GET`
2. URL: `http://localhost:8080/api/users`
3. Headers:
   - `Authorization: Bearer <tu-token-aqui>`
4. Enviar

### Paso 3: Verificar Rechazo de Token Inválido

1. Cambiar el token por algo incorrecto: `Authorization: Bearer invalid-token`
2. Enviar
3. Deberías recibir: `401 Unauthorized`

---

## Configuración

### Cambiar Clave Secreta (IMPORTANTE en Producción)

**En `application.properties`:**
```properties
jwt.secret=tu-clave-secreta-muy-larga-y-segura
jwt.expiration=86400000  # 24 horas en milisegundos
```

**O usando variables de entorno:**
```bash
export JWT_SECRET=tu-clave-secreta-segura
export JWT_EXPIRATION=86400000
```

### Rutas Públicas (Sin Autenticación)

Definidas en `JwtFilter.java`:
```java
private static final String[] PUBLIC_PATHS = {
    "/users/login",      // Login
    "/users/register",   // Registro (si lo implementas)
    "/swagger-ui",       // Swagger UI
    "/v3/api-docs",      // OpenAPI docs
    "/swagger-resources" // Recursos de Swagger
};
```

---

## Estructura del Token JWT

### Payload Contiene:

```json
{
  "sub": "admin",           // subject (username)
  "userId": 1,              // ID del usuario
  "iat": 1680000000,        // issued at (fecha creación)
  "exp": 1680086400         // expiration (fecha expiración)
}
```

### Tiempo de Expiración

- **Por defecto**: 24 horas
- **Configurable**: En `application.properties`
- **Unidad**: milisegundos

---

## Métodos Principales

### JwtUtil

```java
// Generar token
String token = jwtUtil.generateToken(userId, username);

// Validar token
boolean isValid = jwtUtil.isValidToken(token);

// Extraer datos
Long userId = jwtUtil.getUserIdFromToken(token);
String username = jwtUtil.getUsernameFromToken(token);
Long companyId = jwtUtil.getCompanyIdFromToken(token);
```

### UserService

```java
// Login genera JWT automáticamente
LoginResponse response = userService.login(loginRequest);
String token = response.getToken();
```

---

## Troubleshooting

### ❌ Error: "Token JWT expirado"
**Solución**: Generar nuevo token haciendo login nuevamente

### ❌ Error: "Token JWT inválido"
**Causas posibles**:
- Token modificado
- Clave secreta diferente
- Token malformado
- Falta `Bearer ` en el header

**Solución**: 
```
Authorization: Bearer <token-completo>
```

### ❌ Error: "401 Unauthorized"
**Causas posibles**:
- Token ausente en el header
- Token vacío
- Token expirado

**Solución**: Verificar que el header contiene el token correcto

### ❌ Error: "CORS policy: blocked"
**Solución**: La configuración CORS está en `SecurityConfig.java`, permite:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React)

---

## Frontend - Cómo Usar el Token

### Guardar Token (React)

```javascript
const login = async (username, password) => {
  const response = await fetch('http://localhost:8080/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  
  const data = await response.json()
  
  // Guardar token
  localStorage.setItem('jwt_token', data.token)
  
  return data
}
```

### Usar Token en Requests (React)

```javascript
const getPedidos = async () => {
  const token = localStorage.getItem('jwt_token')
  
  const response = await fetch('http://localhost:8080/api/pedidos', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  return response.json()
}
```

---

## Testing

### Ejecutar Tests JWT

```bash
mvn test -Dtest=UserServiceJwtTest
```

### Test Coverage

```bash
mvn clean test jacoco:report
```

Los tests cubren:
- ✅ Login exitoso genera token
- ✅ Token tiene información del usuario
- ✅ Credenciales incorrectas no generan token
- ✅ Usuario sin compañía funciona correctamente

---

## 🎯 Resumen

| Aspecto | Detalles |
|---------|----------|
| **Algoritmo** | HS512 (HMAC SHA-512) |
| **Expiración** | 24 horas (configurable) |
| **Validación** | Automática en cada request |
| **Rutas Públicas** | `/users/login`, `/swagger-ui` |
| **Rutas Protegidas** | Todas las demás requieren token |
| **Formato Header** | `Authorization: Bearer <token>` |
| **Clave Secreta** | Configurar en producción |

---

## 📚 Referencias

- [JWT.io](https://jwt.io) - Decodificar y entender tokens
- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [RFC 7519 - JWT Standard](https://tools.ietf.org/html/rfc7519)

---

**¡JWT implementado correctamente! 🔐** Tu aplicación ahora tiene autenticación profesional y segura.
