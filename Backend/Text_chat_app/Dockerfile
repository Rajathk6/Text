FROM maven:3.9.9-eclipse-temurin-21-jammy AS build

WORKDIR /app

COPY target\Text_chat_app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "app.jar" ]