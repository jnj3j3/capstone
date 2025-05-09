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
exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = Number(process.env.REDIS_DOCKER_PORT || 6379);
if (isNaN(port)) {
    throw new Error("Invalid REDIS_DOCKER_PORT: not a number");
}
const client = (0, redis_1.createClient)({
    socket: {
        host: "redis",
        port: port,
        reconnectStrategy: (retries) => {
            console.error(`Redis reconnect attempt #${retries}`);
            return Math.min(retries * 100, 3000);
        },
    },
});
client.on("error", (err) => console.log("Redis Client Error", err));
let isConnected = false;
const redisClient = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isConnected) {
        try {
            yield client.connect();
            isConnected = true;
        }
        catch (err) {
            console.error("Error connecting to Redis", err);
            throw err;
        }
    }
    return client;
});
exports.redisClient = redisClient;
//# sourceMappingURL=redis.js.map