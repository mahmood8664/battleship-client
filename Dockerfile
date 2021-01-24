FROM node:12.18.1-alpine3.12 AS build
RUN mkdir app
COPY . /app
WORKDIR /app
RUN npm run build-production && \
    mkdir /dist && \
RUN ls
#FROM alpine:3.12
#RUN mkdir /app
#WORKDIR /app
#COPY --from=build /out /app
#EXPOSE 9090
#CMD ["./battleship", "start"]
