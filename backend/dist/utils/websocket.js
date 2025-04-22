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
function setupQueueSocket(io) {
    io.on("connection", (socket) => {
        socket.on("join-queue", (_a) => __awaiter(this, [_a], void 0, function* ({ ticketId, userId }) {
            try {
                yield (0, redisUtils_1.joinQueue)(ticketId, userId); // 이 부분에서 에러가 날 가능성
                const key = `${ticketId}:${userId}`;
                userSockets.set(key, socket);
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
    setInterval(() => __awaiter(this, void 0, void 0, function* () {
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
}
//# sourceMappingURL=websocket.js.map