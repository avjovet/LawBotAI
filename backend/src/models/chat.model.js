const prisma = require('../utils/prisma');

const ChatModel = {
  create: ({ usuarioId, perfilBot = null }) =>
    prisma.chat.create({
      data: { usuarioId, perfilBot },
    }),

  findById: (id) =>
    prisma.chat.findUnique({
      where: { id },
      include: {
        mensajes: true,
        usuario: true,
      },
    }),

  findAllByUsuarioId: (usuarioId) =>
    prisma.chat.findMany({
      where: { usuarioId },
      orderBy: { fecha: 'desc' },
    }),

  delete: (id) =>
    prisma.chat.delete({
      where: { id },
    }),

  updatePerfilBot: (id, perfilBot) =>
    prisma.chat.update({
      where: { id },
      data: { perfilBot },
    }),
};

module.exports = ChatModel;
