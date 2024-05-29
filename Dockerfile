FROM node:21.7.3-alpine3.18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]