// Silenciar completamente los mensajes de dotenv
const originalStdout = process.stdout.write;
process.stdout.write = function (chunk, encoding, callback) {
  if (typeof chunk === 'string' && chunk.includes('[dotenv@')) {
    return true; // Silenciar mensajes de dotenv
  }
  return originalStdout.call(this, chunk, encoding, callback);
};

require('dotenv').config();

// Restaurar stdout después de cargar dotenv
process.stdout.write = originalStdout;

const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    uploadPath: process.env.UPLOAD_PATH || 'uploads/'
  }
};

module.exports = config;