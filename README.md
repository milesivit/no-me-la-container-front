# NOMELA CONTAINER 🚢

Aplicación **front-end** para la gestión de un servicio de **transporte
marítimo de contenedores**, desarrollada en **React + Vite**.\
Permite administrar barcos, viajes, contenedores, clientes, reservas,
pagos, servicios adicionales y usuarios/empleados.

# 🌤️ Clima en destinos de reserva

La aplicación integra la **API de OpenWeather** para mostrar el clima actual de los puertos a los que viajan los contenedores.
Los clientes pueden consultar el estado del clima en tiempo real directamente desde la sección de **Mis Reservas**.

# 🤖 Chatbot para clientes

El sistema incluye un **chatbot integrado** que permite a los clientes **realizar consultas rápidas**.

------------------------------------------------------------------------

## 🧰 Tecnologías principales

-   **React**
-   **Vite**
-   **JavaScript (ES6+)**
-   **React Router**
-   **Context API**
-   **PrimeReact**
-   **Axios / fetch**
-   **CSS modularizado**

------------------------------------------------------------------------

## 📂 Estructura del proyecto

    no-me-la-container-front/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── img/
    │   ├── layouts/
    │   ├── auth/
    │   ├── barco/
    │   ├── cargaContainer/
    │   ├── cliente/
    │   ├── container/
    │   ├── empleado/
    │   ├── home/
    │   ├── pago/
    │   ├── reserva/
    │   ├── servicios/
    │   ├── viaje/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── README.md

------------------------------------------------------------------------

## 🧩 Módulos funcionales

### **Auth**

Pantallas de login, logout, validación de usuario y `AuthContext`.

### **Home**

Dashboard principal.

### **Barco**

CRUD de barcos y vinculación con viajes.

### **Viaje**

Gestión de viajes marítimos: puertos, fechas, estado y barco asignado.

### **Container**

CRUD de contenedores y estados.

### **CargaContainer**

Administración de cargas asociadas a contenedores.

### **Cliente**

Gestión completa de clientes.

### **Reserva**

Flujo completo de creación de reservas, validaciones, servicios
agregados, etc.

### **Servicios**

Servicios adicionales asociables a reservas.

### **Pago**

Módulo de facturación y pagos.

### **Empleado**

Gestión de personal del sistema.

### **Layouts / Components**

Layouts reutilizables y UI components.

### **Context**

Manejo global de estado para todas las entidades.

### **Services**

Capa de comunicación con la API REST (axios/fetch).

### **Utils**

Helpers, notificaciones, formateadores, etc.

------------------------------------------------------------------------

## 🚀 Cómo ejecutar

``` bash
git clone https://github.com/milesivit/no-me-la-container-front.git
cd no-me-la-container-front
npm install
npm run dev
```

Generalmente en: **http://localhost:5173**

------------------------------------------------------------------------

## 🔌 Integración con el back-end

-   Se comunica con **no-me-la-container-back** (Node/Express +
    Sequelize)
-   URL por defecto: `http://localhost:3000`

------------------------------------------------------------------------

## 🧪 Buenas prácticas incorporadas

-   Separación clara de capas (vistas, context, services)
-   Componentes reutilizables
-   Notificaciones centralizadas
-   Baja lógica del lado del backend
-   Estado global consolidado

------------------------------------------------------------------------

## 🤝 Contribuciones

1.  Fork

2.  Rama nueva:

    ``` bash
    git checkout -b feature/nueva-feature
    ```

3.  Commit + push

4.  Pull Request

------------------------------------------------------------------------

## 📄 Licencia

Proyecto académico sin licencia explícita. Se recomienda agregar
`LICENSE` (MIT sugerida).
