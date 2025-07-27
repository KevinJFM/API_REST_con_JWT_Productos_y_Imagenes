const Joi = require('joi');

// Esquema de validación para Usuario
const usuarioSchema = {
  // Validación para registro de usuario
  registro: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.max': 'La contraseña no puede exceder 128 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
        'any.required': 'La contraseña es requerida'
      }),
    rol: Joi.string()
      .valid('user', 'admin')
      .default('user')
      .messages({
        'any.only': 'El rol debe ser "user" o "admin"'
      })
  }),

  // Validación para login de usuario
  login: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .messages({
        'string.email': 'Por favor ingresa un email válido (ejemplo: usuario@dominio.com)',
        'any.required': 'El email es requerido para iniciar sesión'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña es requerida para iniciar sesión'
      })
  }),

  // Validación para actualización de usuario
  actualizacion: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .messages({
        'string.email': 'El email debe tener un formato válido'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.max': 'La contraseña no puede exceder 128 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      }),
    rol: Joi.string()
      .valid('user', 'admin')
      .messages({
        'any.only': 'El rol debe ser "user" o "admin"'
      }),
    activo: Joi.boolean()
      .messages({
        'boolean.base': 'El campo activo debe ser verdadero o falso'
      })
  }).min(1)
};

// Esquema de validación para Producto
const productoSchema = {
  // Validación para creación de producto
  creacion: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    descripcion: Joi.string()
      .max(1000)
      .trim()
      .allow('')
      .messages({
        'string.max': 'La descripción no puede exceder 1000 caracteres'
      }),
    precio: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.positive': 'El precio debe ser un número positivo',
        'number.precision': 'El precio no puede tener más de 2 decimales',
        'any.required': 'El precio es requerido'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
      }),
    activo: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'El campo activo debe ser verdadero o falso'
      }),
    // Nuevos campos para imágenes
    imagen_url: Joi.string()
      .uri()
      .max(500)
      .messages({
        'string.uri': 'La URL de imagen debe ser válida',
        'string.max': 'La URL no puede exceder 500 caracteres'
      }),
    imagen_tipo: Joi.string()
      .valid('upload', 'url')
      .messages({
        'any.only': 'El tipo de imagen debe ser "upload" o "url"'
      })
  }),

  // Validación para actualización de producto
  actualizacion: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres'
      }),
    descripcion: Joi.string()
      .max(1000)
      .trim()
      .allow('')
      .messages({
        'string.max': 'La descripción no puede exceder 1000 caracteres'
      }),
    precio: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.positive': 'El precio debe ser un número positivo',
        'number.precision': 'El precio no puede tener más de 2 decimales'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
      }),
    activo: Joi.boolean()
      .messages({
        'boolean.base': 'El campo activo debe ser verdadero o falso'
      }),
    // Nuevos campos para imágenes
    imagen_url: Joi.string()
      .uri()
      .max(500)
      .messages({
        'string.uri': 'La URL de imagen debe ser válida',
        'string.max': 'La URL no puede exceder 500 caracteres'
      }),
    imagen_tipo: Joi.string()
      .valid('upload', 'url')
      .messages({
        'any.only': 'El tipo de imagen debe ser "upload" o "url"'
      })
  }).min(1)
};

// Esquemas de validación para parámetros de URL
const parametrosSchema = {
  // Validación para ID en parámetros
  id: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.integer': 'El ID debe ser un número entero',
        'number.positive': 'El ID debe ser un número positivo',
        'any.required': 'El ID es requerido'
      })
  }),

  // Validación para paginación
  paginacion: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.integer': 'La página debe ser un número entero',
        'number.min': 'La página debe ser mayor a 0'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.integer': 'El límite debe ser un número entero',
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede exceder 100'
      }),
    search: Joi.string()
      .max(100)
      .trim()
      .allow('')
      .messages({
        'string.max': 'La búsqueda no puede exceder 100 caracteres'
      })
  })
};

// Esquemas de validación para archivos
const archivoSchema = {
  // Validación para upload de imágenes
  imagen: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp')
      .required()
      .messages({
        'any.only': 'Solo se permiten archivos de imagen (JPEG, PNG, WebP)'
      }),
    size: Joi.number()
      .max(5242880) // 5MB
      .required()
      .messages({
        'number.max': 'El archivo no puede exceder 5MB'
      }),
    buffer: Joi.binary().required(),
    filename: Joi.string(),
    path: Joi.string()
  })
};

module.exports = {
  usuarioSchema,
  productoSchema,
  parametrosSchema,
  archivoSchema
};