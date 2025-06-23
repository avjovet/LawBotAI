-- Crear base de datos
CREATE DATABASE ragdb;

-- Conectar a la nueva base
\connect ragdb;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(100),
  password_hash TEXT NOT NULL
);

-- Tabla de chats
CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes
CREATE TABLE mensajes (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id),
  rol VARCHAR(20), -- 'user' o 'assistant'
  contenido TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
