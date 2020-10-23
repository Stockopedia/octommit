FROM node:14.13.0-alpine3.10 as builder

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npm run build

FROM builder as app

COPY --from=builder /app/dist /app/dist/

COPY package*.json /app/

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npm", "run", "start" ]