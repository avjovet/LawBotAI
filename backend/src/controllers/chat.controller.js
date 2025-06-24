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
    // 🔄 Crear nuevo chat con el modelo
    const chat = await ChatModel.create(userId);

    // 💬 Guardar mensaje del usuario
    const userMessage = await MensajeModel.create({
      chatId: chat.id,
      rol: 'user',
      contenido: prompt,
    });

    // 🌐 Llamada al modelo de IA en Colab vía ngrok
    const llamaResponse = await axios.post(
      'https://3014-34-125-2-7.ngrok-free.app/v1/chat/completions',
      {
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    const respuestaIA = llamaResponse.data.choices[0].message.content;

    // 🤖 Guardar mensaje del asistente
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
    res.status(500).json({ message: 'Error al comunicarse con lawbot pipipipi' });
  }
};

module.exports = { handleChat };
