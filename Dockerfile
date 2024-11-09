# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de tu proyecto al contenedor
COPY . .

# Expone el puerto en el que tu aplicación se ejecuta
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["npm", "start"]
