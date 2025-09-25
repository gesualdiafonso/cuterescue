# API REST - Trabajo Practio de Aplicaciones Hibridas y BackEnd Test para Proyecto Final

La API servirá como una comunicación hibrida en cual va mas a futuro combinar desde Hardware, Software y un Servicio Digital, siendo un proyecto que se base en permitir a los dueños de pet monitorear sus Pets, propuesta es en tiempo real y garantizar seguridad con comunicación intermedia de una API futura de Alertas que debe ser emitido según el cambio de la PET de la ubicaicón inesperada por el dueño. 

La API que está apresentada estamos en los Testes iniciales comprobatorios, con un CRUD de Usuarios, Detalles del usuario y PETs, donde inicia la ubicación e punto 0 por ahora, futuramente se estende para que sea según la Ubicaicó del usuario y con Comunicación de API de Terceros para actualización de GPS en propuesta automatica, generando una comunicación de API por Alertas.

**A seguir apresento un poco sobre el proyecto y la API y un Roadmap**

## 🐾 Cute Rescue API REST

API REST - Trabajo Práctico de Aplicaciones Híbridas y BackEnd Test para Proyecto Final  
**Escuela Da Vinci | Comisión: 2 AV Noche**  
**Alumno:** Afonso Arruda Gesualdi  
**Docente:** Jonathan Emanuel Cruz  

---

## 🐾 Test de la Api
⚠️ **Observación:**  
Los campos de Id creados en los usuarios son únicos y reflejan en la comunicación con otros recursos como: **userId**, **dueno_id**.  
Son obligatorios y están hasheados en **hex**.  
**No se comunica con `_id`.**

---

### 👤 Usuarios
- **GET /api/users** → Listar todos los usuarios  
- **GET /api/users/:id** → Consultar usuario por ID  
- **GET /api/users/email/:id** → Consultar usuario por Email  
- **POST /api/users** → Crear usuario  
- **PUT /api/user/:userId/details** → Actualiza el usuario 
- **DELETE /api/user/:userId/details** → Deleta el usuario
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
  - Respuesta
  ```json
  {
    "id": "hash-id",
    "email": "string",
    "password": "hash-string",
    "activo": true,
  }
  ```

### 🫡 Usuarios Details
- **GET /api/details** → Listar todos los usuarios  
- **POST /api/users/:userId/details** → Crear el detalles de usuarios 
- **PUT /api/user/:userId/details** → Actualiza el detalles del usuario 
- **DELETE /api/user/:userId/details** → Deleta el detalles de usuarios 
  ```json
  {
    "userId": "hash-id",
    "nombre": "string",
    "telefono": "string",
    "ubicacion": "string",
    "pets": []
  }
  ```
  - Respuesta
  ```json
  {
    "userId": "hash-id",
    "nombre": "string",
    "telefono": "string",
    "ubicacion": "string",
    "pets": []
  }
  ```

### 🐾 Pet
- **GET /api/pets** → Listar todos los pets  
- **GET /api/pets/:id** → Pega el pet por el ID
- **GET /api/pets/chip/:chip_id** → Pega el pet por el valor chip_id
- **POST /api/pets** → Crea el pet
- **PUT /api/pets/:id** → Actualiza el pet 
- **DELETE /api/pets/:id** → Deleta el pet
  ```json
  {
    "chip_id": "CHIP-HASH",
    "nombre": "string",
    "especie": "string",
    "raza": "string",
    "dueno_id": "hash-id",
    "fecha_nacimiento": "string",
    "edad": 0,
    "sexo": "string",
    "color": "string",
    "foto_url": "string",
    "estado_salud": "string",
    "collar_bateria": 100,
    "nivel_actividad": "string"
  }
  ```
  - Respuesta
  ```json
  {
    "chip_id": "CHIP-HASH",
    "nombre": "string",
    "especie": "string",
    "raza": "string",
    "dueno_id": "hash-id",
    "fecha_nacimiento": "string",
    "edad": 0,
    "sexo": "string",
    "color": "string",
    "foto_url": "string",
    "estado_salud": "string",
    "collar_bateria": 100,
    "nivel_actividad": "string"
  }
  ```

### 📍 Locations
- **GET /api/locations** → Listar todos los pets  
- **GET /api/locations/:chip_id** → Pega el pet por el ID
  ```json
  {
    "chip_id": "CHIP-HASH",
    "lat": 0,
    "lng": 0,
    "timestamp": "2025-09-25T00:00:00Z"
  }
  ```
---

### Iniciar el proyecto
  ```bash
    npm start 
  ```

---

### Variables de Entorno
  ```bash
    PORT=3000
    MONGO_URI=mongodb+srv://cuterescue_admin:gJqOT3x6yMpsPgYR@cluster44489.erthep0.mongodb.net/cuterescue?retryWrites=true&w=majority&appName=Cluster44489
  ```
---

## 📌 Descripción del Proyecto

La **Cute Rescue API** es el **punto de partida (fase 0)** de un ecosistema PetTech que busca garantizar la **seguridad, rastreabilidad y cuidado integral de mascotas**.  

En su estado actual, la API permite gestionar información de **Usuarios, Detalles de usuario, Pets y Localización inicial (punto 0)** usando **MongoDB Atlas** como base de datos.  
Este es el **primer paso hacia un sistema integral** que en el futuro integrará hardware IoT, una aplicación híbrida multiplataforma y un ecosistema de servicios digitales.

---

## ⚙️ Estado Actual (API 0 - Test)

### Funcionalidades disponibles
- CRUD de **Usuarios** (email y contraseña).
- CRUD de **Detalles de usuario** (nombre, teléfono, ubicación).
- CRUD de **Pets** (identificación por `chip_id`).
- CRUD de **Localización** → al crear un Pet se genera automáticamente una ubicación inicial en coordenadas `0`.

### Tecnologías
- **Node.js + Express**
- **MongoDB Atlas** (almacenamiento cloud)
- **API REST** con endpoints validados
- **Bootstrap + HTML** para documentación visual

---
## 🛣️ Roadmap del Proyecto

El desarrollo de Cute Rescue se plantea en **fases escalables**:

### 🔹 Fase 0 (actual)
- API REST básica con CRUD de Usuarios, Detalles, Pets y Localización.
- Gestión de datos en MongoDB Atlas.
- Validaciones iniciales de endpoints.

### 🔹 Fase 1
- **Aplicación Hibrida WEB:**
  - Cambios en algunas funcionalidad de la API actual.
  - Perfil multi-pet con ingreso de foto, datos y estado.
  - Aplicación de una API de Geolocalización en tiempo real.
  - Notificaciones básicas de comunicación al lado Front.
- **Alertas inteligentes iniciales:**
  - Fuga de mascota.
  - Movimiento inesperado.
  - Chip inactivo.

### 🔹 Fase 2
- **Integración con Hardware IoT (ESP32 con GPS):**
  - Captura de ubicación en tiempo real.
  - Envío periódico de datos hacia la API.
  - Sistema de fallback en caso de pérdida de señal.

### 🔹 Fase 3
- **Aplicación Híbrida (Android, iOS):**
  - Creación de la App por modulo Native.
  - Creación de perfil y comunicación con HTTPs.
  - Creación Front Geolocalización en tiempo real
  - Notificación y Comunicación.

### 🔹 Fase 4 y 5 Modelos y aplicación de Negocio, Nada a compartir!

## 🛠️ Tecnologías Clave

- **Back-End:** Node.js, Express, MongoDB Atlas 
- **Front-End:** Bootstrap, Aplicación Híbrida (futuro con frameworks híbridos)  
- **IoT:** ESP32 con GPS, Smart Tags  
- **Infraestructura:** APIs REST, servicios cloud  
- **Integraciones futuras:** Google Maps API, notificaciones push  

---

## 📌 Conclusión

Cute Rescue no es solo una API de pruebas, sino el inicio de un **ecosistema integral de geolocalización y seguridad animal**, que combina:  

- **Hardware IoT (ESP32 con GPS)**  
- **Software moderno (App Híbrida + API REST)**  
- **Servicios digitales (alertas, tele-veterinaria, marketplace, comunidad con ONGs)**  

> Nuestra meta es transformar la **seguridad de mascotas** en un servicio confiable, escalable y con impacto social positivo.  