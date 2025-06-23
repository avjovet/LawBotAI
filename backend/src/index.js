require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');


const protectedRoutes = require('./routes/protected.routes'); 

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint básico de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API funcionando' });
});

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Rutas protegidas
app.use('/api/protected', protectedRoutes); // 🆕


// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
