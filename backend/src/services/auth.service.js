const db = require('../config/db');

const createUser = async ({ email, nombre, password_hash }) => {
  const result = await db.query(
    'INSERT INTO usuarios (email, nombre, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [email, nombre, password_hash]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail };
