FROM node:jod-alpine3.21

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Variables de entorno
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "dist/app.js"]