const jwt = require('jsonwebtoken');

// Middleware JWT optimizado con mejor rendimiento
module.exports = (roleIds = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token requerido' });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Token inválido' });

            // roleIds puede ser un array de números [1, 2] donde 1=ADMIN, 2=VEN
            if (roleIds.length && !roleIds.includes(decoded.role_id)) {
                return res.status(403).json({ error: 'No autorizado para esta acción' });
            }

            req.user = decoded;
            next();
        });
    };
};