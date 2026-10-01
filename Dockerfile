# syntax=docker/dockerfile:1
FROM node:24-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn-lock.json*", "./"]

RUN yarn install --production=true

COPY . .

CMD ["yarn", "start"]