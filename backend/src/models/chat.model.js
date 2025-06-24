const prisma = require('../utils/prisma');

const ChatModel = {
  create: (usuarioId) =>
    prisma.chat.create({
      data: { usuarioId },
    }),
};

module.exports = ChatModel;
