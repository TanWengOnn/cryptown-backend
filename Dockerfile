FROM node:16-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install --omit=dev