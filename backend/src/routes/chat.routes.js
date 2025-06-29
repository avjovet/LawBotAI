const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear un nuevo chat con IA (nuevo contexto)
router.post('/nuevo', chatController.handleChat);

// Continuar un chat ya existente (mantiene contexto)
router.post('/:chatId/preguntar', chatController.responderEnChatExistente);

// Obtener todos los chats de un usuario
router.get('/', chatController.getChatsByUser);

router.get('/resumenes', chatController.getResumenesDeChats);
// Obtener mensajes de un chat específico
router.get('/:chatId', chatController.getMensajesDeChat);

// Eliminar un chat (y sus mensajes asociados)
router.delete('/:chatId', chatController.deleteChat);

// Actualizar el perfil del bot (clave del JSON)
router.put('/:chatId/perfil', chatController.actualizarPerfilBot);


module.exports = router;
