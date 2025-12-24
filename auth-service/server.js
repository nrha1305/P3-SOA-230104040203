// 1. Import library yang dibutuhkan
require('dotenv').config(); // agar bisa baca file .env
const express = require('express'); // framework web
const jwt = require('jsonwebtoken'); // untuk buat token JWT
const cors = require('cors'); // agar API bisa diakses dari luar

// 2. Instalasi express
const app = express();
app.use(cors());
app.use(express.json()); // agar bisa baca body JSON dari request

// 3. Simulasi data user (seolah-olah database)
const users = [
    { username: 'mhs1', password: '123456' },
    { username: 'mhs2', password: '654321' }
];

// 4. Endpoint GET / -> hanya untuk cek server
app.get('/', (req, res) => {
    res.send('Auth Service aktif');
});

// 5. Endpoint POST/login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // cek input ada atau tidak
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan Password wajib diisi' });
    }
    // cari user di "database"
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Login gagal, username atau password salah' });
    }
    //Buat payload JWT (isi token)
    const payload = { username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    // kirim token ke client
    res.json({
        message: 'Login sukses',
        token
    });
});

// 6. Jalankan server
const PORT = process.env.PORT ||4000;
app.listen(PORT, () => {
    console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});