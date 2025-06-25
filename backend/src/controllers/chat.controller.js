const axios = require('axios');
const ChatModel = require('../models/chat.model');
const MensajeModel = require('../models/mensaje.model');

const handleChat = async (req, res) => {
  const userId = req.userId;
  const { prompt } = req.body;

  if (!prompt) {
    console.warn("⚠ Prompt vacío recibido");
    return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
  }

  try {
    console.log("📝 Creando nuevo chat...");
    const chat = await ChatModel.create(userId);

    console.log("💬 Guardando mensaje del usuario...");
    const userMessage = await MensajeModel.create({
      chatId: chat.id,
      rol: 'user',
      contenido: prompt,
    });

    console.log("🌐 Enviando prompt al modelo LLaMA-3...");
    const llamaResponse = await axios.post(
      'https://253c-34-147-74-238.ngrok-free.app/v1/chat/completions',  // ✅ Nuevo endpoint
      {
        messages: [
          { role: "system", content: "Eres un experto legal. Responde en base a tu conocimiento y sé claro." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    console.log("🤖 Respuesta recibida:", llamaResponse.data);
    const respuestaIA = llamaResponse.data.choices[0].message.content;

    console.log("💬 Guardando mensaje del asistente...");
    const aiMessage = await MensajeModel.create({
      chatId: chat.id,
      rol: 'assistant',
      contenido: respuestaIA,
    });

    console.log("✅ Chat y mensajes guardados correctamente.");
    res.status(200).json({
      message: 'Mensaje procesado',
      chatId: chat.id,
      messages: [userMessage, aiMessage],
    });

  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('❌ Error Axios al comunicarse con el modelo LLaMA-3:');
      console.error('↳ Código:', err.response?.status);
      console.error('↳ Data:', err.response?.data);
    } else {
      console.error('❌ Error general en el controlador de chat:', err.message);
    }

    res.status(500).json({ message: 'Error al comunicarse con el modelo LLaMA-3' });
  }
};

module.exports = { handleChat };
