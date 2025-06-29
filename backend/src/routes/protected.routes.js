const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const prisma = require('../utils/prisma'); // <-- ¡Este import es necesario!

// Ruta de prueba
router.get('/test', verifyToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado a ruta protegida',
    userId: req.userId,
  });
});

// Ruta /me para obtener datos del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: { id: true, nombre: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Acceso autorizado a ruta protegida',
      user,
    });
  } catch (err) {
    console.error("Error al obtener usuario:", err.message);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
