const { Sequelize } = require('sequelize');
// dotenv ya se carga en config/index.js

module.exports = new Sequelize(
  process.env.DB_NAME || 'tienda',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'fantasma',
  { 
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false // Desactivar todos los logs de Sequelize
  }
);