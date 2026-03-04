FROM node:current
RUN npm install -g pm2
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["pm2-runtime", "start", "./dist/server.js", "-i", "max"]