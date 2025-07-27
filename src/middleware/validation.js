const Joi = require('joi');

/**
 * Middleware de validación que usa esquemas Joi
 * @param {Object} schema - Objeto con esquemas de validación para body, params, query
 * @param {Joi.Schema} schema.body - Esquema para validar req.body
 * @param {Joi.Schema} schema.params - Esquema para validar req.params
 * @param {Joi.Schema} schema.query - Esquema para validar req.query
 * @param {Joi.Schema} schema.file - Esquema para validar req.file
 * @param {Joi.Schema} schema.files - Esquema para validar req.files
 * @returns {Function} Middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validar body si se proporciona esquema
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        const bodyErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value,
          type: 'body'
        }));
        errors.push(...bodyErrors);
      } else {
        // Asignar valores validados y transformados
        req.body = value;
      }
    }

    // Validar params si se proporciona esquema
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        const paramErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value,
          type: 'params'
        }));
        errors.push(...paramErrors);
      } else {
        req.params = value;
      }
    }

    // Validar query si se proporciona esquema
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        const queryErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value,
          type: 'query'
        }));
        errors.push(...queryErrors);
      } else {
        req.query = value;
      }
    }

    // Validar archivo único si se proporciona esquema
    if (schema.file && req.file) {
      const { error, value } = schema.file.validate(req.file, {
        abortEarly: false,
        allowUnknown: true
      });

      if (error) {
        const fileErrors = error.details.map(detail => ({
          field: `file.${detail.path.join('.')}`,
          message: detail.message,
          value: detail.context?.value,
          type: 'file'
        }));
        errors.push(...fileErrors);
      }
    }

    // Validar múltiples archivos si se proporciona esquema
    if (schema.files && req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

      files.forEach((file, index) => {
        const { error } = schema.files.validate(file, {
          abortEarly: false,
          allowUnknown: true
        });

        if (error) {
          const fileErrors = error.details.map(detail => ({
            field: `files[${index}].${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value,
            type: 'files'
          }));
          errors.push(...fileErrors);
        }
      });
    }

    // Si hay errores, retornar respuesta de error
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada inválidos',
          details: errors,
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method
        }
      });
    }

    // Si no hay errores, continuar con el siguiente middleware
    next();
  };
};

/**
 * Middleware específico para validar solo el body
 * @param {Joi.Schema} schema - Esquema Joi para validar req.body
 * @returns {Function} Middleware function
 */
const validateBody = (schema) => {
  return validate({ body: schema });
};

/**
 * Middleware específico para validar solo los parámetros
 * @param {Joi.Schema} schema - Esquema Joi para validar req.params
 * @returns {Function} Middleware function
 */
const validateParams = (schema) => {
  return validate({ params: schema });
};

/**
 * Middleware específico para validar solo la query
 * @param {Joi.Schema} schema - Esquema Joi para validar req.query
 * @returns {Function} Middleware function
 */
const validateQuery = (schema) => {
  return validate({ query: schema });
};

/**
 * Middleware específico para validar archivos
 * @param {Joi.Schema} schema - Esquema Joi para validar archivos
 * @returns {Function} Middleware function
 */
const validateFile = (schema) => {
  return validate({ file: schema });
};

/**
 * Función helper para crear respuestas de error de validación consistentes
 * @param {string} message - Mensaje principal del error
 * @param {Array} details - Detalles específicos de los errores
 * @param {Object} req - Objeto request de Express
 * @returns {Object} Objeto de respuesta de error
 */
const createValidationError = (message, details, req) => {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: message || 'Datos de entrada inválidos',
      details: details || [],
      timestamp: new Date().toISOString(),
      path: req?.path || '',
      method: req?.method || ''
    }
  };
};

/**
 * Función helper para validar datos manualmente
 * @param {any} data - Datos a validar
 * @param {Joi.Schema} schema - Esquema Joi
 * @param {Object} options - Opciones de validación
 * @returns {Object} Resultado de la validación
 */
const validateData = (data, schema, options = {}) => {
  const defaultOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
    ...options
  };

  const { error, value } = schema.validate(data, defaultOptions);

  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));

    return {
      isValid: false,
      errors: details,
      data: null
    };
  }

  return {
    isValid: true,
    errors: [],
    data: value
  };
};

module.exports = {
  validate,
  validateBody,
  validateParams,
  validateQuery,
  validateFile,
  createValidationError,
  validateData
};