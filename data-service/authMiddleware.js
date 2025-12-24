// authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization || '';

    // Wajib format: Authorization: Bearer <token>
    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Header Authorization Bearer <token> wajib' });
    }

    const token = auth.slice(7); // hapus "Bearer "
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // simpan info user untuk dipakai di handler berikutnya
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid atau kedaluarsa', error: err.message });
    }
}

module.exports = authMiddleware;