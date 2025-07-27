const { sequelize } = require('../models');

const initDatabase = async () => {
  try {
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    // console.log('✅ Modelos sincronizados correctamente');

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { initDatabase };