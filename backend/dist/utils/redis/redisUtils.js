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
exports.setAsync = setAsync;
exports.getAsync = getAsync;
exports.delAsync = delAsync;
const redis_1 = require("./redis");
function setAsync(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, redis_1.redisClient)();
        return client.set(key.toString(), value);
    });
}
function getAsync(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, redis_1.redisClient)();
        return client.get(key.toString());
    });
}
function delAsync(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, redis_1.redisClient)();
        return client.del(key.toString());
    });
}
//# sourceMappingURL=redisUtils.js.map