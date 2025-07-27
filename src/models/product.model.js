module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    pid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'PID'
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'NOMBRE'
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'PRECIO'
    },
    imagen_url: {
      type: DataTypes.STRING(500),
      field: 'IMAGEN_URL'
    },
    imagen_tipo: {
      type: DataTypes.ENUM('upload', 'url'),
      field: 'IMAGEN_TIPO'
    },
    imagen_nombre: {
      type: DataTypes.STRING(255),
      field: 'IMAGEN_NOMBRE'
    },
    imagen_mime: {
      type: DataTypes.STRING(50),
      field: 'IMAGEN_MIME'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'USER_ID'
    }
  }, {
    tableName: 'PRODUCTS',
    timestamps: false
  });
  Producto.associate = models => {
    Producto.belongsTo(models.Usuario, { foreignKey: 'USER_ID', targetKey: 'uid' });
  };
  return Producto;
};