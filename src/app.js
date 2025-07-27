const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { initDatabase } = require('./database/init');

// Crear aplicación Express
const app = express();

// Configurar middleware global con CSP personalizado
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Permitir scripts inline
        "https://cdn.jsdelivr.net" // Permitir axios desde CDN
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Permitir estilos inline
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"] // Para peticiones AJAX
    }
  }
}));
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Morgan desactivado para logs silenciosos
// const morganFormat = config.server.env === 'production' ? 'combined' : 'dev';
// app.use(morgan(morganFormat));

// Middleware para parsing de JSON y URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('src/uploads'));

// Registrar rutas principales
const routes = require('./routes');
app.use('/', routes);



// Importar middlewares de error
const { errorHandler, notFoundHandler } = require('./middleware/errormiddleware');

// Registrar middleware de manejo de errores (debe ir al final)
app.use(notFoundHandler);
app.use(errorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Inicializar base de datos
    await initDatabase();

    const server = app.listen(config.server.port, () => {
      console.log(`🚀 Servidor ejecutándose en el puerto ${config.server.port}`);
      console.log(`🔗 URL: http://localhost:${config.server.port}`);
    });

    // Manejo graceful de cierre del servidor
    const gracefulShutdown = (signal) => {
      // console.log(`\n📡 Señal ${signal} recibida. Cerrando servidor...`);
      server.close(() => {
        // console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    // Solo mostrar errores críticos
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Exportar app para testing y servidor para ejecución
module.exports = { app, startServer };

// Si este archivo se ejecuta directamente, iniciar el servidor
if (require.main === module) {
  startServer();
}