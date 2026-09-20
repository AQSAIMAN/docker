FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching
COPY package.json ./
RUN npm install

# Copy the rest of the app
COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]
