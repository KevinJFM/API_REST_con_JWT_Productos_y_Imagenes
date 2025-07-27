const config = require('../config');

// Middleware de manejo de errores global
const errorHandler = (err, req, res, next) => {
  // Log del error (comentado para logs silenciosos)
  // console.error('Error:', {
  //   message: err.message,
  //   stack: config.server.env === 'development' ? err.stack : undefined,
  //   url: req.url,
  //   method: req.method,
  //   timestamp: new Date().toISOString()
  // });

  // Determinar código de estado
  let statusCode = err.statusCode || err.status || 500;
  
  // Manejar errores específicos de Sequelize
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    err.message = 'Datos de entrada inválidos';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    err.message = 'El recurso ya existe';
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    err.message = 'Referencia inválida';
  }

  // Respuesta de error
  const errorResponse = {
    error: {
      message: err.message || 'Error interno del servidor',
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  };

  // En desarrollo, incluir stack trace
  if (config.server.env === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.path}`,
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};