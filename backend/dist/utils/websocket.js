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
const globalUserIntervals = new Map();
function setupQueueSocket(io) {
    io.on("connection", (socket) => {
        console.log("Client connected to queue system");
        socket.on("join-queue", (_a) => __awaiter(this, [_a], void 0, function* ({ ticketId, userId }) {
            yield (0, redisUtils_1.joinQueue)(ticketId, userId);
            const key = `${ticketId}:${userId}`;
            if (globalUserIntervals.has(key)) {
                clearInterval(globalUserIntervals.get(key));
            }
            const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const rank = yield (0, redisUtils_1.getQueueRank)(ticketId, userId);
                if (rank === -1) {
                    console.log("User left the queue");
                    socket.emit("queue-update", { rank: -1 });
                    clearInterval(interval);
                    globalUserIntervals.delete(key);
                    return;
                }
                socket.emit("queue-update", { rank });
            }), 3000);
            globalUserIntervals.set(key, interval);
            socket.on("disconnect", () => {
                clearInterval(interval);
                globalUserIntervals.delete(key);
                console.log("Queue user disconnected");
            });
        }));
    });
}
//# sourceMappingURL=websocket.js.map