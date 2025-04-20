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
        console.log("Client connected");
        socket.on("join-queue", (_a) => __awaiter(this, [_a], void 0, function* ({ ticketId, userId }) {
            yield (0, redisUtils_1.joinQueue)(ticketId, userId);
            const key = `${ticketId}:${userId}`;
            userSockets.set(key, socket);
        }));
        socket.on("disconnect", () => {
            for (const [key, s] of userSockets) {
                if (s.id === socket.id) {
                    userSockets.delete(key);
                    console.log("User disconnected from queue");
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