FROM node:12.18.1-alpine3.12 AS build
RUN mkdir app
COPY . /app
WORKDIR /app
RUN npm install && \
    npm run build-production
FROM nginx:1.19
COPY .docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./app/dist/ /usr/share/nginx/html
USER root
RUN chgrp -R 0 /usr/share/nginx && chmod -R g=u /usr/share/nginx
COPY .docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
USER nginx
ENTRYPOINT ["/entrypoint.sh"]

