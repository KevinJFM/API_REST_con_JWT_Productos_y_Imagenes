const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Valida si una URL es una imagen válida
 */
const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Obtiene el tipo MIME de una URL de imagen
 */
const getImageMimeFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      const contentType = res.headers['content-type'];
      if (contentType && contentType.startsWith('image/')) {
        resolve(contentType);
      } else {
        reject(new Error('URL no es una imagen válida'));
      }
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout al verificar la URL'));
    });
    
    req.end();
  });
};

/**
 * Obtiene información de archivo subido
 */
const getUploadedFileInfo = (file) => {
  return {
    url: `/uploads/${file.filename}`,
    tipo: 'upload',
    nombre: file.originalname,
    mime: file.mimetype
  };
};

/**
 * Tipos MIME permitidos para imágenes
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Valida si el tipo MIME es permitido
 */
const isAllowedImageType = (mimeType) => {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
};

module.exports = {
  isValidImageUrl,
  getImageMimeFromUrl,
  getUploadedFileInfo,
  isAllowedImageType,
  ALLOWED_IMAGE_TYPES
};