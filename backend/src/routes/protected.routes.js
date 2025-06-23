const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get('/test', verifyToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado a ruta protegida',
    userId: req.userId,
  });
});

module.exports = router;
