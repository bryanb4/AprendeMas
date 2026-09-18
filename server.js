const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./rutas/authRoutes');
const examenRoutes = require('./rutas/examenRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
// authRoutes incluye /login, /register, /verify, /profile y /resultados
// Se monta en los 3 prefijos por compatibilidad con el frontend actual
app.use('/api/auth', authRoutes);
app.use('/api/results', authRoutes);
app.use('/api/profile', authRoutes);
app.use('/api/examen', examenRoutes);

app.get('/api/health', async (req, res) => {
  let db = 'down';
  try {
    const pool = require('./db/conexion');
    await pool.query('SELECT 1');
    db = 'up';
  } catch (e) {
    db = 'down: ' + e.message;
  }
  res.json({ ok: true, db, smtp: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS) });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});