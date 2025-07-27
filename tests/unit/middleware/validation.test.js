const Joi = require('joi');
const { 
  validate, 
  validateBody, 
  validateParams, 
  validateQuery, 
  validateFile,
  createValidationError,
  validateData 
} = require('../../../src/middleware/validation');

// Mock de req, res, next para testing
const createMockReq = (body = {}, params = {}, query = {}, file = null, files = null) => ({
  body,
  params,
  query,
  file,
  files,
  path: '/test',
  method: 'POST'
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe('Validation Middleware', () => {
  
  describe('validate function', () => {
    
    test('should pass validation with valid data', () => {
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().required()
        })
      };

      const req = createMockReq({ name: 'Juan', age: 25 });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 400 error with invalid body data', () => {
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().required()
        })
      };

      const req = createMockReq({ name: '', age: 'invalid' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: 'Datos de entrada inválidos',
            details: expect.arrayContaining([
              expect.objectContaining({
                field: expect.any(String),
                message: expect.any(String),
                type: 'body'
              })
            ])
          })
        })
      );
    });

    test('should validate params correctly', () => {
      const schema = {
        params: Joi.object({
          id: Joi.number().integer().positive().required()
        })
      };

      const req = createMockReq({}, { id: '123' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.params.id).toBe(123); // Should be converted to number
    });

    test('should return error for invalid params', () => {
      const schema = {
        params: Joi.object({
          id: Joi.number().integer().positive().required()
        })
      };

      const req = createMockReq({}, { id: 'invalid' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({
                type: 'params'
              })
            ])
          })
        })
      );
    });

    test('should validate query parameters correctly', () => {
      const schema = {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10)
        })
      };

      const req = createMockReq({}, {}, { page: '2', limit: '20' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.query.page).toBe(2);
      expect(req.query.limit).toBe(20);
    });

    test('should validate file upload correctly', () => {
      const schema = {
        file: Joi.object({
          fieldname: Joi.string().required(),
          originalname: Joi.string().required(),
          mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
          size: Joi.number().max(5242880).required()
        })
      };

      const mockFile = {
        fieldname: 'image',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024000,
        buffer: Buffer.from('test')
      };

      const req = createMockReq({}, {}, {}, mockFile);
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should return error for invalid file', () => {
      const schema = {
        file: Joi.object({
          mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
          size: Joi.number().max(1000000).required()
        })
      };

      const mockFile = {
        mimetype: 'text/plain',
        size: 2000000
      };

      const req = createMockReq({}, {}, {}, mockFile);
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({
                type: 'file'
              })
            ])
          })
        })
      );
    });

    test('should handle multiple validation errors', () => {
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required()
        }),
        params: Joi.object({
          id: Joi.number().required()
        })
      };

      const req = createMockReq(
        { name: '', email: 'invalid-email' },
        { id: 'not-a-number' }
      );
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      
      const response = res.json.mock.calls[0][0];
      expect(response.error.details).toHaveLength(3); // name, email, id errors
      expect(response.error.details.some(d => d.type === 'body')).toBe(true);
      expect(response.error.details.some(d => d.type === 'params')).toBe(true);
    });

  });

  describe('validateBody function', () => {
    
    test('should validate body only', () => {
      const schema = Joi.object({
        name: Joi.string().required()
      });

      const req = createMockReq({ name: 'Test' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

  });

  describe('validateParams function', () => {
    
    test('should validate params only', () => {
      const schema = Joi.object({
        id: Joi.number().required()
      });

      const req = createMockReq({}, { id: '123' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validateParams(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.params.id).toBe(123);
    });

  });

  describe('validateQuery function', () => {
    
    test('should validate query only', () => {
      const schema = Joi.object({
        search: Joi.string().optional()
      });

      const req = createMockReq({}, {}, { search: 'test' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validateQuery(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

  });

  describe('validateFile function', () => {
    
    test('should validate file only', () => {
      const schema = Joi.object({
        mimetype: Joi.string().valid('image/jpeg').required()
      });

      const mockFile = {
        mimetype: 'image/jpeg'
      };

      const req = createMockReq({}, {}, {}, mockFile);
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validateFile(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

  });

  describe('createValidationError function', () => {
    
    test('should create proper error object', () => {
      const req = createMockReq();
      const details = [{ field: 'name', message: 'Required' }];
      
      const error = createValidationError('Test error', details, req);

      expect(error).toEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Test error',
          details: details,
          timestamp: expect.any(String),
          path: '/test',
          method: 'POST'
        }
      });
    });

    test('should use default message when not provided', () => {
      const error = createValidationError();

      expect(error.error.message).toBe('Datos de entrada inválidos');
    });

  });

  describe('validateData function', () => {
    
    test('should return valid result for correct data', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required()
      });

      const data = { name: 'Juan', age: 25 };
      const result = validateData(data, schema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.data).toEqual(data);
    });

    test('should return invalid result for incorrect data', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required()
      });

      const data = { name: '', age: 'invalid' };
      const result = validateData(data, schema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.data).toBe(null);
    });

    test('should apply custom options', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        extra: Joi.string()
      });

      const data = { name: 'Juan', unknownField: 'value' };
      const result = validateData(data, schema, { allowUnknown: true });

      expect(result.isValid).toBe(true);
    });

  });

  describe('Edge cases', () => {
    
    test('should handle empty schemas', () => {
      const req = createMockReq({ name: 'test' });
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate({});
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should handle missing req properties', () => {
      const schema = {
        file: Joi.object({
          mimetype: Joi.string().required()
        })
      };

      const req = createMockReq(); // No file property
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled(); // Should pass when no file to validate
    });

    test('should handle array files correctly', () => {
      const schema = {
        files: Joi.object({
          mimetype: Joi.string().valid('image/jpeg').required()
        })
      };

      const mockFiles = [
        { mimetype: 'image/jpeg' },
        { mimetype: 'text/plain' } // Invalid
      ];

      const req = createMockReq({}, {}, {}, null, mockFiles);
      const res = createMockRes();
      const next = createMockNext();

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

  });

});