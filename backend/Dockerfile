# backend/Dockerfile
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de dependencias primero (para aprovechar cache)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Genera el cliente Prisma
RUN npx prisma generate

# Expone el puerto de la API
EXPOSE 4000

# Comando para ejecutar la API
CMD ["node", "src/index.js"]
