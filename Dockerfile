FROM node:14.15.5-alpine3.12 AS build
RUN mkdir app
COPY . /app
WORKDIR /app
RUN npm install && \
    npm run build-production
FROM nginx:stable
COPY .docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./app/dist/ /usr/share/nginx/html
COPY .docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

