const prisma = require('../utils/prisma');

const UsuarioModel = {
  findByEmail: (email) => prisma.usuario.findUnique({ where: { email } }),

  create: ({ nombre, email, passwordHash }) =>
    prisma.usuario.create({
      data: { nombre, email, passwordHash },
    }),
};

module.exports = UsuarioModel;
