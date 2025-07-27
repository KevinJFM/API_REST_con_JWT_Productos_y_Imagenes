const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const authMiddleware = require('../middleware/jwt.middlware');
const upload = require('../config/multer');
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const { productoSchema, parametrosSchema } = require('../utils/validators');

// Middleware para manejar upload opcional
const optionalUpload = (req, res, next) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error al subir archivo: ' + err.message });
    }
    next();
  });
};

// Rutas públicas
router.get('/', 
  validateQuery(parametrosSchema.paginacion), 
  productoController.getAll
);

// Rutas protegidas
router.post('/', 
  authMiddleware([1, 2]), // ADMIN y VEN pueden crear productos
  optionalUpload,
  validateBody(productoSchema.creacion),
  productoController.create
);

router.put('/:id', 
  authMiddleware([1, 2]), // ADMIN y VEN pueden actualizar productos
  optionalUpload,
  validateParams(parametrosSchema.id),
  validateBody(productoSchema.actualizacion),
  productoController.update
);

router.delete('/:id', 
  authMiddleware([1, 2]), // ADMIN y VEN pueden eliminar productos
  validateParams(parametrosSchema.id),
  productoController.delete
);

module.exports = router;