const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validation');
const { usuarioSchema } = require('../utils/validators');

const authMiddleware = require('../middleware/jwt.middlware');

// Rutas con validación
router.post('/register', validateBody(usuarioSchema.registro), authController.register);
router.post('/login', validateBody(usuarioSchema.login), authController.login);

// Rutas protegidas para usuarios
router.get('/users', authMiddleware([1]), authController.getUsers); // Solo ADMIN
router.put('/users/:id/promote', authMiddleware([1]), authController.promoteUser); // Solo ADMIN

module.exports = router;