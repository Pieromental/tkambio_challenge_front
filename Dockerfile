# Usa Node.js para construir la aplicación
FROM node:18-alpine AS build

WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias (incluye `npm-run-all` si falta)
RUN npm install npm-run-all --omit=dev && npm install

# Copia el resto del código fuente después de instalar dependencias
COPY . .

# Construye la aplicación
RUN npm run build

# Usa Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos compilados desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para la web
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
