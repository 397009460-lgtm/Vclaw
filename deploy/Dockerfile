FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev
WORKDIR /app
COPY . .
EXPOSE 8889
WORKDIR /app/server
CMD ["node", "src/app.js"]
