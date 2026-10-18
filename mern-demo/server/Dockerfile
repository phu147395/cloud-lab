FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

RUN rm -f .env .env.vault .env.keys

CMD ["npm", "start"]
