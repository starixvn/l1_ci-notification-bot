FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine
USER node
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY src src
HEALTHCHECK --interval=10s CMD node src/healthcheck.js
CMD [ "node", "--es-module-specifier-resolution=node", "src/app.js" ]
