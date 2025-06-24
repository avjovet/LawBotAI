const prisma = require('../utils/prisma');

const MensajeModel = {
  create: ({ chatId, rol, contenido }) =>
    prisma.mensaje.create({
      data: { chatId, rol, contenido },
    }),
};

module.exports = MensajeModel;
