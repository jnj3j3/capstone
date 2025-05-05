"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const prom_client_1 = __importDefault(require("prom-client"));
prom_client_1.default.collectDefaultMetrics();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// CORS 및 기본 설정
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const httpRequestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
});
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.set("Content-Type", prom_client_1.default.register.contentType);
        res.end(yield prom_client_1.default.register.metrics());
    }
    catch (ex) {
        res.status(500).end(ex.message);
    }
}));
app.use((req, res, next) => {
    res.on("finish", () => {
        var _a;
        httpRequestCounter.inc({
            method: req.method,
            route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path,
            status: res.statusCode,
        });
    });
    next();
});
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