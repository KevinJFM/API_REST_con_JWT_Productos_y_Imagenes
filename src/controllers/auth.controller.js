const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

exports.register = async (req, res) => {
  try {
    // Mapear campos para la base de datos
    const userData = {
      email: req.body.email,
      user_password: req.body.password,
      user_name: req.body.user_name || req.body.email.split('@')[0], // Usar parte del email si no se proporciona nombre
      role_id: 2 // VEN role por defecto
    };
    
    const user = await Usuario.create(userData);
    res.status(201).json({ 
      id: user.uid, 
      email: user.email, 
      user_name: user.user_name,
      role_id: user.role_id 
    });
  } catch (error) {
    // console.error('Error en registro:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Email o contraseña invalido. Porfavor intente de nuevo.' });
    }
    
    const token = jwt.sign(
      { 
        id: user.uid, 
        email: user.email,
        role_id: user.role_id,
        user_name: user.user_name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.uid,
        email: user.email,
        user_name: user.user_name,
        role_id: user.role_id
      }
    });
  } catch (error) {
    // console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: ['uid', 'email', 'user_name', 'role_id']
    });
    
    res.json({ users });
  } catch (error) {
    // console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    await user.update({ role_id: 1 }); // Promover a ADMIN
    
    res.json({ message: 'Usuario promovido exitosamente' });
  } catch (error) {
    // console.error('Error al promover usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};