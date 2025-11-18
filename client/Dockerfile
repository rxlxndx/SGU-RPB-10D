# Etapa 1: Compilación de los recursos
FROM node:20 AS build 

WORKDIR /app 

COPY package*.json ./

RUN npm install

COPY . .

# TRAER ARGUMENTOS DEL .ENV (Llegan del compose)
ARG API_HOST
ARG API_PORT
ARG API_BASE

# CONFIGURAR VARIABLES DE ENTORNO EN BASE A LO DE ARRIBA (van al .env)
ENV VITE_API_HOST=$API_HOST
ENV VITE_API_PORT=$API_PORT
ENV VITE_API_BASE=$API_BASE

# Genera carpeta dist (frontend compilado)
RUN npm run build

# Etapa 2: Construcción de la imagen
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]