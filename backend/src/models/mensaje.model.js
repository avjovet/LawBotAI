const prisma = require('../utils/prisma');

const MensajeModel = {
  create: ({ chatId, rol, contenido }) =>
    prisma.mensaje.create({
      data: { chatId, rol, contenido },
    }),

  findByChatId: (chatId) =>
    prisma.mensaje.findMany({
      where: { chatId },
      orderBy: { timestamp: 'asc' },
    }),
};

module.exports = MensajeModel;
