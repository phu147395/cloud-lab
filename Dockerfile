FROM node:20

WORKDIR /app

COPY mern-demo/client/package.json mern-demo/client/package-lock.json ./

RUN npm ci

COPY mern-demo/client/ ./

RUN npm run build

EXPOSE 5173

CMD ["sh", "-c", "node runtime-config.cjs && npm run preview -- --host 0.0.0.0 --port 5173"]
