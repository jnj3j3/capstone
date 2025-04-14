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
exports.isUserAllowed = exports.getQueueRank = exports.joinQueue = void 0;
// queue.ts
const redis_1 = require("./redis");
const QUEUE_PREFIX = "ticket_queue:";
const joinQueue = (ticketId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, redis_1.redisClient)();
    const score = Date.now(); // timestamp로 정렬
    // 10분이 지난 데이터는 삭제
    yield client.zRemRangeByScore(`ticket_queue:${ticketId}`, 0, Date.now() - 10 * 60 * 1000);
    yield client.zAdd(`ticket_queue:${ticketId}`, [{ score, value: userId }]);
});
exports.joinQueue = joinQueue;
const getQueueRank = (ticketId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, redis_1.redisClient)();
    const rank = yield client.zRank(`ticket_queue:${ticketId}`, userId);
    return rank !== null ? rank + 1 : -1;
});
exports.getQueueRank = getQueueRank;
const isUserAllowed = (ticketId_1, userId_1, ...args_1) => __awaiter(void 0, [ticketId_1, userId_1, ...args_1], void 0, function* (ticketId, userId, maxRank = 10) {
    const rank = yield (0, exports.getQueueRank)(ticketId, userId);
    return rank > 0 && rank <= maxRank;
});
exports.isUserAllowed = isUserAllowed;
//# sourceMappingURL=redisUtils.js.map