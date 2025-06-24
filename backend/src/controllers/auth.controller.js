const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await UsuarioModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UsuarioModel.create({
      nombre: name,
      email,
      passwordHash: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: { id: user.id, email: user.email, nombre: user.nombre },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsuarioModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, email: user.email, nombre: user.nombre },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

module.exports = { register, login };
