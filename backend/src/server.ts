import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io"; // 중요: 이름 충돌 피하기
import { setupQueueSocket } from "./utils/websocket";
import { startRankingCronJob } from "./cron/rankingCron";

import { db } from "./models";
import { userRouter } from "./routes/userRouter";
import { ticketRouter } from "./routes/ticketRouter";
import { reserveRouter } from "./routes/reserveRouter";
import { ticketRankingRouter } from "./routes/ticketRankingRouter";
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");

const app = express();
const server = http.createServer(app);

// CORS 및 기본 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// socket.io 서버 연결
const io = new IOServer(server, {
  cors: {
    origin: "*",
  },
});
setupQueueSocket(io);

// Sequelize DB 연결
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

// 라우터 연결
app.use("", userRouter);
app.use("", ticketRouter);
app.use("", reserveRouter);
app.use("", ticketRankingRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
startRankingCronJob();
// HTTP + WebSocket 서버 리스닝
const PORT = process.env.NODE_DOCKER_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
