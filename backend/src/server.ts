import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io"; // 중요: 이름 충돌 피하기
import { setupQueueSocket } from "./utils/websocket";
import { startRankingCronJob } from "./cron/rankingCron";
import { createAdapter } from "@socket.io/redis-adapter";
import { db } from "./models";
import { userRouter } from "./routes/userRouter";
import { ticketRouter } from "./routes/ticketRouter";
import { reserveRouter } from "./routes/reserveRouter";
import { ticketRankingRouter } from "./routes/ticketRankingRouter";
import client from "prom-client";
import { redisClient } from "./utils/redis/redis";

client.collectDefaultMetrics();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");

const app = express();
const server = http.createServer(app);

// CORS 및 기본 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

app.get("/metrics", async (req: Request, res: Response) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end((ex as Error).message);
  }
});
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
});
// socket.io 서버 연결
const setupSocket = async (httpServer) => {
  const io = new IOServer(httpServer, {
    httpCompression: false,
    perMessageDeflate: false,
    cors: {
      origin: "*",
    },
    transports: ["websocket"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });
  const mainClient = await redisClient();
  const pubClient = mainClient.duplicate();
  const subClient = mainClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  return io;
};
// const io = new IOServer(server, {
//   httpCompression: false,
//   perMessageDeflate: false,
//   cors: {
//     origin: "*",
//   },
//   transports: ["websocket"],
//   pingTimeout: 60000,
//   pingInterval: 25000,

// });
const startServer = async () => {
  try {
    const io = await setupSocket(server);
    setupQueueSocket(io);
    const PORT = process.env.NODE_DOCKER_PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error setting up Socket.IO:", err);
    process.exit(1);
  }
};
startServer();
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
