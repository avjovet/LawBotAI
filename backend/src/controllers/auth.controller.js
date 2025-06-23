// backend/src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("➡️ Datos recibidos:", { name, email, password });

    const userExists = await prisma.usuario.findUnique({ where: { email } });
    if (userExists) {
      console.log("⚠️ Usuario ya registrado:", email);
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hasheada:", hashedPassword);

    const user = await prisma.usuario.create({
      data: {
        email,
        nombre: name,
        passwordHash: hashedPassword,
      }
    });

    console.log("✅ Usuario creado:", user);

    // 👉 Generar token JWT después de crear el usuario
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 👉 Devolver token al frontend
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
      }
    });
  } catch (err) {
    console.error("❌ Error en register:", err.message);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

module.exports = { register, login };
