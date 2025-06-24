const axios = require('axios');
const ChatModel = require('../models/chat.model');
const MensajeModel = require('../models/mensaje.model');

const handleChat = async (req, res) => {
  const userId = req.userId;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
  }

  try {
    const chat = await ChatModel.create(userId);

    const userMessage = await MensajeModel.create({
      chatId: chat.id,
      rol: 'user',
      contenido: prompt,
    });

    // 🔄 NUEVO ENDPOINT RAG
    const llamaResponse = await axios.post(
      'https://2959-34-124-243-145.ngrok-free.app/v1/rag',
      { question: prompt },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    const respuestaIA = llamaResponse.data.answer;

    const aiMessage = await MensajeModel.create({
      chatId: chat.id,
      rol: 'assistant',
      contenido: respuestaIA,
    });

    res.status(200).json({
      message: 'Mensaje procesado',
      chatId: chat.id,
      messages: [userMessage, aiMessage],
    });

  } catch (err) {
    console.error('❌ Error en el controlador de chat:', err.message);
    res.status(500).json({ message: 'Error al comunicarse con el modelo RAG' });
  }
};

module.exports = { handleChat };
