# Servir imagen de backend con maven
FROM maven:3.9.9-eclipse-temurin-21

# Establecer directorio trabajo
WORKDIR /app

# Copia todos los archivos del proyecto en el directorio de trabajo
COPY . .

# Ejecutar
#   1.- Limpiar y compilar el JAR del backend
#   2.- Copiar el resultante al directorio de trabajo
#       DskipTests es para que no trate de ejecutar las clases
RUN mvn clean package -DskipTests && cp target/*.jar app.jar

EXPOSE 8080

# Servir el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]