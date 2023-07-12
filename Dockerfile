# syntax=docker/dockerfile:1
FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

ENV _CHROMEDRIVER_PATH="/usr/bin/chromedriver"

RUN apk add --update --no-cache chromium chromium-chromedriver

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev

COPY . .

CMD ["node", "index.js"]
