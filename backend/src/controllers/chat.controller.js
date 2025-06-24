const prisma = require('../utils/prisma');
const axios = require('axios');

const handleChat = async (req, res) => {
  const userId = req.userId; // del middleware
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
  }

  try {
    // 🔄 Crea un nuevo chat
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

    // 🌐 Llamada a tu modelo de Colab vía ngrok
    const llamaResponse = await axios.post(
      'https://3014-34-125-2-7.ngrok-free.app/v1/chat/completions',
      {
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      }
    );


    const respuestaIA = llamaResponse.data.choices[0].message.content;

    // 🤖 Guarda respuesta del asistente
    const aiMessage = await prisma.mensaje.create({
      data: {
        chatId: chat.id,
        rol: 'assistant',
        contenido: respuestaIA,
      },
    });

    res.status(200).json({
      message: 'Mensaje procesado',
      chatId: chat.id,
      messages: [userMessage, aiMessage],
    });

  } catch (err) {
    console.error('❌ Error en el controlador de chat:', err.message);
    res.status(500).json({ message: 'Error al comunicarse con el modelo de IA' });
  }
};

module.exports = { handleChat };
