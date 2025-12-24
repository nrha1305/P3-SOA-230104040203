// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// Data dummy: setiap item punya owner (username) yang berhak akses
const items = [
    { id: 1, name: 'Data Rahasia A', owner: 'mhs1' },
    { id: 2, name: 'Data Rahasia B', owner: 'mhs2' }
];

// Cek service
app.get('/', (req, res) => {
    res.send('Data Service OK (protected routes: /data)');
});

// GET /data (TERLINDUNGI)
app.get('/data', authMiddleware, (req, res) => {
    const username = req.user?.username;
    const filtered = items.filter(i => i.owner === username);
    res.json({
        message: `Halo ${username}, berikut data yang dapat kamu akses`,
        data: filtered
    });
});

// POST /data (TERLINDUNGI) - contoh tambah item milik user pemegang token
app.post('/data', authMiddleware, (req, res) => {
    const username = req.user?.username;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name wajib' });

    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const newItem = { id, name, owner: username };
    items.push(newItem);
    res.status(201).json({ message: 'Item dibuat', item: newItem });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Data Service listening on http://localhost:${PORT}`);
});