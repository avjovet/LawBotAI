const prisma = require('../utils/prisma');

const handleChat = async (req, res) => {
  const userId = req.userId; // del middleware
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
  }

  try {
    // 🔄 Crea un nuevo chat (en el futuro podrías reusar uno)
    const chat = await prisma.chat.create({
      data: {
        usuarioId: userId,
      },
    });

    // 💬 Guarda mensaje del usuario
    const userMessage = await prisma.mensaje.create({
      data: {
        chatId: chat.id,
        rol: 'user',
        contenido: prompt,
      },
    });

    // 🤖 Simulación de respuesta del asistente
    const simulatedResponse = 'Estoy analizando tu consulta legal... (respuesta simulada)';

    const aiMessage = await prisma.mensaje.create({
      data: {
        chatId: chat.id,
        rol: 'assistant',
        contenido: simulatedResponse,
      },
    });

    res.status(200).json({
      message: 'Mensaje procesado',
      chatId: chat.id,
      messages: [userMessage, aiMessage],
    });

  } catch (err) {
    console.error('❌ Error en el controlador de chat:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { handleChat };
