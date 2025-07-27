const sequelize = require('../config/db');
const Usuario = require('./usuario.model.js')(sequelize, require('sequelize'));
const Producto = require('./product.model.js')(sequelize, require('sequelize'));
Usuario.associate({ Producto });
Producto.associate({ Usuario });
module.exports = { sequelize, Usuario, Producto };