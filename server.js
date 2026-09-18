const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./rutas/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/results', authRoutes);
app.use('/api/profile', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});