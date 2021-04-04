FROM node:14.13.0-alpine3.10 as builder

WORKDIR /app

ARG TAG

RUN npm -g install @stockopedia/octommit@${TAG}