# 🛍️ Sistema de Productos - API REST & Frontend

Una aplicación web completa para gestión de productos con autenticación, roles de usuario y manejo de imágenes.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Frontend](#-frontend)
- [Base de Datos](#-base-de-datos)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 🔐 **Autenticación y Autorización**
- Sistema de login/registro con JWT
- Roles de usuario (ADMIN, VEN)
- Middleware de autenticación personalizado
- Protección de rutas por roles

### 📦 **Gestión de Productos**
- CRUD completo de productos
- Subida de imágenes (local y URL externa)
- Validación robusta con Joi
- Paginación y filtros

### 🎨 **Frontend Moderno**
- Interfaz responsive con CSS moderno
- Componentes reutilizables (navbar)
- Manejo de estados y errores
- Diseño glassmorphism

### 🛡️ **Seguridad**
- Helmet para headers de seguridad
- Validación de entrada exhaustiva
- Manejo seguro de archivos
- Sanitización de datos

## 🚀 Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **Joi** - Validación de esquemas
- **Multer** - Manejo de archivos
- **Bcrypt** - Hashing de contraseñas

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos modernos
- **JavaScript ES6+** - Lógica del cliente
- **Axios** - Cliente HTTP

### Herramientas de Desarrollo
- **Nodemon** - Desarrollo en tiempo real
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Jest** - Testing
- **Morgan** - Logging HTTP

## 📁 Estructura del Proyecto

```
src/
├── config/              # Configuraciones
│   ├── index.js         # Configuración principal
│   ├── db.js           # Configuración de Sequelize
│   └── multer.js       # Configuración de uploads
├── controllers/         # Controladores
│   ├── auth.controller.js
│   └── producto.controller.js
├── database/           # Base de datos
│   ├── init.js         # Inicialización
│   └── mysql_queries.sql
├── middleware/         # Middlewares personalizados
│   ├── jwt.middlware.js
│   ├── validation.js
│   └── errormiddleware.js
├── models/             # Modelos de Sequelize
│   ├── index.js
│   ├── usuario.model.js
│   └── product.model.js
├── public/             # Frontend estático
│   ├── components/     # Componentes reutilizables
│   ├── styles/         # Archivos CSS
│   ├── js/            # Librerías JavaScript
│   ├── login.html
│   ├── admin.html
│   ├── profile.html
│   └── product.html
├── routes/             # Definición de rutas
│   ├── index.js
│   ├── auth.routes.js
│   └── product.routes.js
├── uploads/            # Archivos subidos
├── utils/              # Utilidades
│   ├── validators.js
│   └── image.utils.js
└── app.js              # Punto de entrada
```

## 🔧 Instalación

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 8.0

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd sistema-productos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
# Crear la base de datos MySQL
mysql -u root -p < src/database/mysql_queries.sql
```

4. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
```

## ⚙️ Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=
NODE_ENV=development

# Base de datos
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=tu_password
DB_NAME=

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=*

# Uploads
UPLOAD_PATH=uploads/
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Scripts disponibles
```bash
npm run dev          # Desarrollo con nodemon
npm run start        # Producción
npm run db:init      # Inicializar base de datos
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run lint         # Linting
npm run format       # Formatear código
```

La aplicación estará disponible en `http://localhost:3000`

## 📡 API Endpoints

### Autenticación
```http
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Iniciar sesión
GET  /api/auth/users       # Listar usuarios (ADMIN)
PUT  /api/auth/users/:id/promote  # Promover usuario (ADMIN)
```

### Productos
```http
GET    /api/v1/products           # Listar productos
POST   /api/v1/products           # Crear producto (AUTH)
PUT    /api/v1/products/:id       # Actualizar producto (AUTH)
DELETE /api/v1/products/:id       # Eliminar producto (AUTH)
```

### Páginas Web
```http
GET /                    # Página principal
GET /login              # Página de login
GET /admin              # Panel de administración
GET /profile            # Perfil de usuario
GET /product            # Gestión de productos
GET /health             # Estado de la API
```

### Ejemplos de Uso

#### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123",
    "user_name": "Usuario Ejemplo"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123"
  }'
```

#### Crear Producto
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer tu_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Ejemplo",
    "precio": 29.99,
    "imagen_url": "https://ejemplo.com/imagen.jpg",
    "imagen_tipo": "url"
  }'
```

## 🎨 Frontend

### Páginas Disponibles

#### 🔐 Login (`/login`)
- Formulario de autenticación
- Registro de nuevos usuarios
- Validación en tiempo real
- Redirección automática por rol

#### 👤 Perfil (`/profile`)
- Información del usuario autenticado
- Navegación personalizada por rol

#### 📦 Productos (`/product`)
- Lista de productos con paginación
- Crear/editar/eliminar productos
- Subida de imágenes
- Filtros y búsqueda

#### 👑 Admin (`/admin`)
- Panel de administración
- Gestión de usuarios
- Promoción de roles
- Estadísticas del sistema

### Componentes

#### Navbar (`/components/navbar.js`)
- Navegación responsive
- Autenticación automática
- Botón de logout con SVG
- Adaptación por rol de usuario

### Características del Frontend
- **Responsive Design** - Adaptable a móviles y desktop
- **Glassmorphism** - Efectos visuales modernos
- **Validación Client-side** - Feedback inmediato
- **Manejo de Estados** - Loading, errores, éxito
- **Componentes Reutilizables** - Código modular

## 🗄️ Base de Datos

### Esquema de Tablas

#### ROLES
```sql
RID (PK) | ROLE_NAME
---------|----------
1        | ADMIN
2        | VEN
```

#### USERS
```sql
UID (PK) | EMAIL | USER_PASSWORD | USER_NAME | ROLE_ID (FK)
```

#### PRODUCTS
```sql
PID (PK) | NOMBRE | PRECIO | IMAGEN_URL | IMAGEN_TIPO | IMAGEN_NOMBRE | IMAGEN_MIME | USER_ID (FK)
```

### Relaciones
- `USERS.ROLE_ID` → `ROLES.RID`
- `PRODUCTS.USER_ID` → `USERS.UID`

## 🔒 Seguridad

### Medidas Implementadas
- **JWT Authentication** - Tokens seguros
- **Password Hashing** - Bcrypt con salt
- **Input Validation** - Joi schemas
- **SQL Injection Protection** - Sequelize ORM
- **XSS Protection** - Helmet middleware
- **CORS Configuration** - Orígenes controlados
- **File Upload Security** - Validación de tipos MIME
- **Rate Limiting** - Protección contra ataques

### Roles y Permisos
- **ADMIN**: Acceso completo al sistema
- **VEN**: Gestión de productos propios

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📈 Performance

### Optimizaciones Implementadas
- **Middleware eficiente** - Una sola función por autenticación
- **Validación temprana** - Joi middleware
- **Archivos estáticos** - Express.static
- **Logging condicional** - Solo en desarrollo
- **Conexión de BD optimizada** - Pool de conexiones

## 🚀 Deployment

### Variables de Entorno para Producción
```env
NODE_ENV=production
PORT=80
DB_HOST=tu_host_produccion
JWT_SECRET=clave_super_segura_produccion
```

### Comandos de Deployment
```bash
# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código
- Usar ESLint y Prettier
- Escribir tests para nuevas funcionalidades
- Documentar cambios en el README
- Seguir convenciones de commits

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@kevinJFM](https://github.com/kevinJFM)

## 🙏 Agradecimientos

- Express.js community
- Sequelize team
- Node.js contributors
- Open source community

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐