FROM node:lts-alpine
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
USER node
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
EXPOSE 5500
CMD ["yarn", "dev"]