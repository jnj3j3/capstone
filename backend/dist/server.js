"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io"); // 중요: 이름 충돌 피하기
const websocket_1 = require("./utils/websocket");
const rankingCron_1 = require("./cron/rankingCron");
const models_1 = require("./models");
const userRouter_1 = require("./routes/userRouter");
const ticketRouter_1 = require("./routes/ticketRouter");
const reserveRouter_1 = require("./routes/reserveRouter");
const ticketRankingRouter_1 = require("./routes/ticketRankingRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// CORS 및 기본 설정
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// socket.io 서버 연결
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
(0, websocket_1.setupQueueSocket)(io);
// Sequelize DB 연결
models_1.db.sequelize
    .sync()
    .then(() => {
    console.log("Database synchronized successfully.");
})
    .catch((err) => {
    console.error("Error synchronizing database:", err);
});
// 라우터 연결
app.use("", userRouter_1.userRouter);
app.use("", ticketRouter_1.ticketRouter);
app.use("", reserveRouter_1.reserveRouter);
app.use("", ticketRankingRouter_1.ticketRankingRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
(0, rankingCron_1.startRankingCronJob)();
// HTTP + WebSocket 서버 리스닝
const PORT = process.env.NODE_DOCKER_PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map