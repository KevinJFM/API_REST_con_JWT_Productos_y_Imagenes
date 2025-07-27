const express = require('express');
const path = require('path');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');

// Servir archivos estáticos desde src/public
router.use(express.static(path.join(__dirname, '../public')));

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Registrar rutas con sus prefijos
router.use('/api/auth', authRoutes); // Auth routes
router.use('/api/v1/products', productRoutes); // Products routes

// Ruta para servir la página de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Ruta para servir la página de admin
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Ruta para servir la página de perfil
router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});

// Ruta para servir la página de productos
router.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/product.html'));
});

// Ruta raíz
router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Productos',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products'
    }
  });
});

module.exports = router;