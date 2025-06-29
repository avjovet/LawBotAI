// controllers/chat.controller.js
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleChat = async (req, res) => {
  const userId = req.userId;
  const { prompt, perfilBot } = req.body;

  if (!prompt) return res.status(400).json({ message: 'El mensaje no puede estar vacío' });

  try {
    const chat = await prisma.chat.create({
      data: { usuarioId: userId, perfilBot }
    });

    const userMessage = await prisma.mensaje.create({
      data: { chatId: chat.id, rol: 'user', contenido: prompt }
    });

    const llamaResponse = await axios.post(
      process.env.LLAMA_API_URL,
      { messages: [{ role: "user", content: prompt }], temperature: 0.7, stream: false },
      { headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' } }
    );

    const respuestaIA = llamaResponse.data.choices[0].message.content;

    const aiMessage = await prisma.mensaje.create({
      data: { chatId: chat.id, rol: 'assistant', contenido: respuestaIA }
    });

    res.status(200).json({ message: 'Mensaje procesado', chatId: chat.id, messages: [userMessage, aiMessage] });
  } catch (err) {
    console.error('Error en handleChat:', err);
    res.status(500).json({ message: 'Error al comunicarse con el modelo LLaMA-3' });
  }
};

const responderEnChatExistente = async (req, res) => {
  const userId = req.userId;
  const { chatId } = req.params;
  const { prompt } = req.body;

  try {
    const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) } });
    if (!chat || chat.usuarioId !== userId) return res.status(404).json({ message: 'Chat no encontrado' });

    const userMessage = await prisma.mensaje.create({
      data: { chatId: chat.id, rol: 'user', contenido: prompt }
    });

    const llamaResponse = await axios.post(
      process.env.LLAMA_API_URL,
      { messages: [{ role: "user", content: prompt }], temperature: 0.7, stream: false },
      { headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' } }
    );

    const respuestaIA = llamaResponse.data.choices[0].message.content;

    const aiMessage = await prisma.mensaje.create({
      data: { chatId: chat.id, rol: 'assistant', contenido: respuestaIA }
    });

    res.status(200).json({ message: 'Respuesta procesada', messages: [userMessage, aiMessage] });
  } catch (err) {
    console.error('Error en responderEnChatExistente:', err);
    res.status(500).json({ message: 'Error al comunicarse con el modelo LLaMA-3' });
  }
};

const getChatsByUser = async (req, res) => {
  const userId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' },
      include: { mensajes: true }
    });
    res.status(200).json(chats);
  } catch (err) {
    console.error('Error al obtener chats del usuario:', err);
    res.status(500).json({ message: 'Error al obtener chats' });
  }
};

const getMensajesDeChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    const mensajes = await prisma.mensaje.findMany({
      where: { chatId: parseInt(chatId) },
      orderBy: { timestamp: 'asc' }
    });
    res.status(200).json(mensajes);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

const deleteChat = async (req, res) => {
  const userId = req.userId;
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) } });
    if (!chat || chat.usuarioId !== userId) return res.status(404).json({ message: 'Chat no encontrado' });

    await prisma.chat.delete({ where: { id: parseInt(chatId) } });


    res.status(200).json({ message: 'Chat eliminado' });
  } catch (err) {
    console.error('Error al eliminar chat:', err);
    res.status(500).json({ message: 'Error al eliminar el chat' });
  }
};

const actualizarPerfilBot = async (req, res) => {
  const userId = req.userId;
  const { chatId } = req.params;
  const { perfilBot } = req.body;

  try {
    const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) } });
    if (!chat || chat.usuarioId !== userId) return res.status(404).json({ message: 'Chat no encontrado' });

    const chatActualizado = await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: { perfilBot }
    });
    res.status(200).json(chatActualizado);
  } catch (err) {
    console.error('Error al actualizar perfil del bot:', err);
    res.status(500).json({ message: 'Error al actualizar el perfil del bot' });
  }
};

const getResumenesDeChats = async (req, res) => {
  const userId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        fecha: true,
        mensajes: {
          take: 1,
          where: { rol: 'user' },
          orderBy: { timestamp: 'asc' },
          select: { contenido: true },
        },
      },
    });

    const resumenes = chats.map(chat => ({
      chatId: chat.id,
      titulo: chat.mensajes[0]?.contenido || "(Sin mensaje)",
      fecha: chat.fecha,
    }));

    res.json(resumenes);
  } catch (err) {
    console.error("❌ Error al obtener resumenes de chats:", err.message);
    res.status(500).json({ message: "Error del servidor al obtener chats." });
  }
};

module.exports = {
  handleChat,
  responderEnChatExistente,
  getChatsByUser,
  getMensajesDeChat,
  deleteChat,
  actualizarPerfilBot,
  getResumenesDeChats
};
