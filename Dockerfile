FROM hub.lumigame.com/docker-hub/library/node:alpine
WORKDIR /app
RUN chown node:node /app
USER node
COPY package.json yarn.lock ./
RUN yarn install --production
COPY src src
HEALTHCHECK --interval=10s CMD node src/healthcheck.js
CMD [ "node", "--es-module-specifier-resolution=node", "src/app" ]
