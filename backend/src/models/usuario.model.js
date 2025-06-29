const prisma = require('../utils/prisma');

const UsuarioModel = {
  create: ({ email, nombre, passwordHash }) =>
    prisma.usuario.create({
      data: { email, nombre, passwordHash },
    }),

  findByEmail: (email) =>
    prisma.usuario.findUnique({
      where: { email },
    }),

  findById: (id) =>
    prisma.usuario.findUnique({
      where: { id },
    }),

  getAll: () =>
    prisma.usuario.findMany(),

  update: (id, data) =>
    prisma.usuario.update({
      where: { id },
      data,
    }),

  delete: (id) =>
    prisma.usuario.delete({
      where: { id },
    }),
};

module.exports = UsuarioModel;
