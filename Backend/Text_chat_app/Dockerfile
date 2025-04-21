# copying all the file and storing it in docker image to run it on servers
FROM maven:3.9.4-eclipse-temurin-21-alpine AS build
COPY . .
RUN mvn clean package -DskipTests

# openjdk is the server we will be running our .jar file 
FROM openjdk:21-jdk-slim
# RUN apt-get update && \
#     apt-get install -y ca-certificates && \
#     update-ca-certificates && \
#     rm -rf /var/lib/apt/lists/*
COPY --from=build /target/Text_chat_app-0.0.1-SNAPSHOT.jar Text.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "Text.jar" ]