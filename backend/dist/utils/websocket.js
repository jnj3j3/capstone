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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupQueueSocket = setupQueueSocket;
const redisUtils_1 = require("./redis/redisUtils");
const userSockets = new Map(); // userKey -> socket
const queueTimers = new Map(); // ticketId -> setInterval timer
function setupQueueSocket(io) {
    io.on("connection", (socket) => {
        socket.on("join-queue", (_a) => __awaiter(this, [_a], void 0, function* ({ ticketId, userId }) {
            try {
                yield (0, redisUtils_1.joinQueue)(ticketId, userId); // 큐에 사용자 추가
                const key = `${ticketId}:${userId}`;
                userSockets.set(key, socket);
                // ticketId에 대해 setInterval이 이미 실행 중이 아니라면 새로 시작
                if (!queueTimers.has(ticketId)) {
                    const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        for (const [key, socket] of userSockets) {
                            const [ticketId, userId] = key.split(":");
                            const rank = yield (0, redisUtils_1.getQueueRank)(ticketId, userId);
                            if (rank === -1) {
                                socket.emit("queue-update", { rank: -1 });
                                userSockets.delete(key);
                            }
                            else {
                                socket.emit("queue-update", { rank });
                            }
                        }
                    }), 3000);
                    // 해당 ticketId에 대한 setInterval 타이머 저장
                    queueTimers.set(ticketId, timer);
                }
            }
            catch (err) {
                console.error("Error in join-queue:", err, userId);
                socket.emit("error", { message: "Something went wrong!" });
            }
        }));
        socket.on("disconnect", () => {
            for (const [key, s] of userSockets) {
                if (s.id === socket.id) {
                    userSockets.delete(key);
                    break;
                }
            }
        });
    });
}
//# sourceMappingURL=websocket.js.map