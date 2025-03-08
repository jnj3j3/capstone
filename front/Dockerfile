FROM node:20.11.1
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .

# React 개발 서버가 외부에서도 접속 가능하도록 설정
ENV HOST=0.0.0.0
ENV PORT=8080

CMD [ "npm", "start" ]