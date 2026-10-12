FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["sh", "-c", "node runtime-config.cjs && npm run preview -- --host 0.0.0.0 --port 5173"]
