const { 
  usuarioSchema, 
  productoSchema, 
  parametrosSchema, 
  archivoSchema 
} = require('../../../src/utils/validators');

describe('Validation Schemas', () => {

  describe('usuarioSchema', () => {
    
    describe('registro schema', () => {
      
      test('should validate correct user registration data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Password123',
          rol: 'user'
        };

        const { error, value } = usuarioSchema.registro.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.email).toBe(validData.email);
        expect(value.password).toBe(validData.password);
        expect(value.rol).toBe(validData.rol);
      });

      test('should use default role when not provided', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Password123'
        };

        const { error, value } = usuarioSchema.registro.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.rol).toBe('user');
      });

      test('should reject invalid email format', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'Password123'
        };

        const { error } = usuarioSchema.registro.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('email');
        expect(error.details[0].message).toContain('formato válido');
      });

      test('should reject weak password', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'weak'
        };

        const { error } = usuarioSchema.registro.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details.some(d => d.path.includes('password'))).toBe(true);
      });

      test('should reject invalid role', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Password123',
          rol: 'invalid-role'
        };

        const { error } = usuarioSchema.registro.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('rol');
      });

    });

    describe('login schema', () => {
      
      test('should validate correct login data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'anypassword'
        };

        const { error } = usuarioSchema.login.validate(validData);
        
        expect(error).toBeUndefined();
      });

      test('should require email and password', () => {
        const invalidData = {};

        const { error } = usuarioSchema.login.validate(invalidData, { abortEarly: false });
        
        expect(error).toBeDefined();
        expect(error.details).toHaveLength(2);
      });

    });

  });

  describe('productoSchema', () => {
    
    describe('creacion schema', () => {
      
      test('should validate correct product creation data', () => {
        const validData = {
          nombre: 'Producto Test',
          descripcion: 'Descripción del producto',
          precio: 99.99,
          stock: 10,
          activo: true
        };

        const { error, value } = productoSchema.creacion.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.nombre).toBe(validData.nombre);
        expect(value.precio).toBe(validData.precio);
      });

      test('should use default values', () => {
        const validData = {
          nombre: 'Producto Test',
          precio: 99.99
        };

        const { error, value } = productoSchema.creacion.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.stock).toBe(0);
        expect(value.activo).toBe(true);
      });

      test('should reject negative price', () => {
        const invalidData = {
          nombre: 'Producto Test',
          precio: -10
        };

        const { error } = productoSchema.creacion.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('precio');
        expect(error.details[0].message).toContain('positivo');
      });

      test('should reject too short name', () => {
        const invalidData = {
          nombre: 'A',
          precio: 99.99
        };

        const { error } = productoSchema.creacion.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('nombre');
      });

      test('should reject negative stock', () => {
        const invalidData = {
          nombre: 'Producto Test',
          precio: 99.99,
          stock: -5
        };

        const { error } = productoSchema.creacion.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('stock');
      });

    });

    describe('actualizacion schema', () => {
      
      test('should validate partial update data', () => {
        const validData = {
          nombre: 'Nuevo Nombre'
        };

        const { error } = productoSchema.actualizacion.validate(validData);
        
        expect(error).toBeUndefined();
      });

      test('should require at least one field', () => {
        const invalidData = {};

        const { error } = productoSchema.actualizacion.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain('at least');
      });

    });

  });

  describe('parametrosSchema', () => {
    
    describe('id schema', () => {
      
      test('should validate positive integer ID', () => {
        const validData = { id: 123 };

        const { error, value } = parametrosSchema.id.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.id).toBe(123);
      });

      test('should convert string ID to number', () => {
        const validData = { id: '123' };

        const { error, value } = parametrosSchema.id.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.id).toBe(123);
      });

      test('should reject negative ID', () => {
        const invalidData = { id: -1 };

        const { error } = parametrosSchema.id.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('id');
      });

    });

    describe('paginacion schema', () => {
      
      test('should validate pagination parameters', () => {
        const validData = {
          page: 2,
          limit: 20,
          search: 'test'
        };

        const { error, value } = parametrosSchema.paginacion.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.page).toBe(2);
        expect(value.limit).toBe(20);
        expect(value.search).toBe('test');
      });

      test('should use default values', () => {
        const validData = {};

        const { error, value } = parametrosSchema.paginacion.validate(validData);
        
        expect(error).toBeUndefined();
        expect(value.page).toBe(1);
        expect(value.limit).toBe(10);
      });

      test('should reject limit over 100', () => {
        const invalidData = { limit: 150 };

        const { error } = parametrosSchema.paginacion.validate(invalidData);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('limit');
      });

    });

  });

  describe('archivoSchema', () => {
    
    describe('imagen schema', () => {
      
      test('should validate correct image file', () => {
        const validFile = {
          fieldname: 'image',
          originalname: 'test.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 1024000,
          buffer: Buffer.from('test')
        };

        const { error } = archivoSchema.imagen.validate(validFile);
        
        expect(error).toBeUndefined();
      });

      test('should reject invalid mimetype', () => {
        const invalidFile = {
          fieldname: 'image',
          originalname: 'test.txt',
          encoding: '7bit',
          mimetype: 'text/plain',
          size: 1024,
          buffer: Buffer.from('test')
        };

        const { error } = archivoSchema.imagen.validate(invalidFile);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('mimetype');
        expect(error.details[0].message).toContain('imagen');
      });

      test('should reject file too large', () => {
        const invalidFile = {
          fieldname: 'image',
          originalname: 'test.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 10485760, // 10MB
          buffer: Buffer.from('test')
        };

        const { error } = archivoSchema.imagen.validate(invalidFile);
        
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('size');
        expect(error.details[0].message).toContain('5MB');
      });

    });

  });

});