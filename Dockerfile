FROM node:9.10-alpine
COPY . /app

WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install pm2 -g  --registry=https://registry.npm.taobao.org
RUN echo 'prod' > /app/config/env

EXPOSE 7000 7001
CMD pm2 start server.js --no-daemon
