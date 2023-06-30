FROM node:lts-alpine
MAINTAINER Wellington dos Santos Castor
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 80
EXPOSE 443
CMD [ "http-server", "dist" ]