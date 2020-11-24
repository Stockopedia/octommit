FROM node:14.13.0-alpine3.10 as builder

WORKDIR /app

ARG TAG
ARG NPM_TOKEN

ENV NODE_ENV production
ENV NPM_TOKEN ${NPM_TOKEN}

RUN npm set registry https://verdaccio.stocko-infra.net
RUN npm config set //verdaccio.stocko-infra.net/:_authToken ${NPM_TOKEN}
RUN npm config set //verdaccio.stocko-infra.net/:always-auth true

RUN npm -g install @octommit/cli@${TAG} --registry https://verdaccio.stocko-infra.net