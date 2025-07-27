const { Producto } = require('../models');
const path = require('path');
const {
  isValidImageUrl,
  getImageMimeFromUrl,
  getUploadedFileInfo,
  isAllowedImageType
} = require('../utils/image.utils');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const { count, rows } = await Producto.findAndCountAll({ offset, limit });
    res.json({ total: count, data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.create = async (req, res) => {
  try {
    let imageData = {};

    // Si hay archivo subido
    if (req.file) {
      if (!isAllowedImageType(req.file.mimetype)) {
        return res.status(400).json({
          error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP'
        });
      }

      const fileInfo = getUploadedFileInfo(req.file);
      imageData = {
        imagen_url: fileInfo.url,
        imagen_tipo: fileInfo.tipo,
        imagen_nombre: fileInfo.nombre,
        imagen_mime: fileInfo.mime
      };
    }
    // Si hay URL de imagen
    else if (req.body.imagen_url) {
      if (!isValidImageUrl(req.body.imagen_url)) {
        return res.status(400).json({ error: 'URL de imagen no válida' });
      }

      try {
        const mimeType = await getImageMimeFromUrl(req.body.imagen_url);
        if (!isAllowedImageType(mimeType)) {
          return res.status(400).json({
            error: 'La URL no apunta a una imagen válida'
          });
        }

        imageData = {
          imagen_url: req.body.imagen_url,
          imagen_tipo: 'url',
          imagen_nombre: null,
          imagen_mime: mimeType
        };
      } catch (error) {
        return res.status(400).json({
          error: 'No se pudo verificar la imagen en la URL proporcionada'
        });
      }
    }

    const producto = await Producto.create({
      ...req.body,
      ...imageData,
      user_id: req.user.id
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    if (req.user.role_id !== 1 && producto.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este producto' });
    }

    let imageData = {};

    // Si hay archivo subido
    if (req.file) {
      if (!isAllowedImageType(req.file.mimetype)) {
        return res.status(400).json({
          error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP'
        });
      }

      const fileInfo = getUploadedFileInfo(req.file);
      imageData = {
        imagen_url: fileInfo.url,
        imagen_tipo: fileInfo.tipo,
        imagen_nombre: fileInfo.nombre,
        imagen_mime: fileInfo.mime
      };
    }
    // Si hay URL de imagen
    else if (req.body.imagen_url) {
      if (!isValidImageUrl(req.body.imagen_url)) {
        return res.status(400).json({ error: 'URL de imagen no válida' });
      }

      try {
        const mimeType = await getImageMimeFromUrl(req.body.imagen_url);
        if (!isAllowedImageType(mimeType)) {
          return res.status(400).json({
            error: 'La URL no apunta a una imagen válida'
          });
        }

        imageData = {
          imagen_url: req.body.imagen_url,
          imagen_tipo: 'url',
          imagen_nombre: null,
          imagen_mime: mimeType
        };
      } catch (error) {
        return res.status(400).json({
          error: 'No se pudo verificar la imagen en la URL proporcionada'
        });
      }
    }

    await producto.update({ ...req.body, ...imageData });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

exports.delete = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    if (req.user.role_id !== 1 && producto.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este producto' });
    }

    await producto.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};