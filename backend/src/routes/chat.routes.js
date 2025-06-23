const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chat.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/', verifyToken, handleChat);

module.exports = router;
