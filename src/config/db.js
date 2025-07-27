const { Sequelize } = require('sequelize');
// dotenv ya se carga en config/index.js

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false // Desactivar todos los logs de Sequelize
  }
);