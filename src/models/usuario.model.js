const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'UID'
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      field: 'EMAIL'
    },
    user_password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      field: 'USER_PASSWORD'
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'USER_NAME'
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2, // VEN role by default
      field: 'ROLE_ID'
    }
  }, {
    tableName: 'USERS',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.user_password) {
          usuario.user_password = await bcrypt.hash(usuario.user_password, 10);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('user_password')) {
          usuario.user_password = await bcrypt.hash(usuario.user_password, 10);
        }
      }
    }
  });

  // Método para validar contraseña
  Usuario.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.user_password);
  };

  Usuario.associate = models => {
    Usuario.hasMany(models.Producto, { foreignKey: 'USER_ID', sourceKey: 'uid' });
  };

  return Usuario;
};