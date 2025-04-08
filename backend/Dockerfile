FROM node:current

WORKDIR /dist
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD npm run start