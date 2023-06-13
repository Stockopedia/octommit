FROM node:18.16-alpine as builder

WORKDIR /app

ARG TAG

RUN npm -g install @stockopedia/octommit@${TAG}
