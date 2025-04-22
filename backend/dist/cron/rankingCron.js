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
exports.stopRankingCronJob = exports.startRankingCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const ticketRankingFunction_1 = require("../controllers/ticketRanking/ticketRankingFunction");
const startRankingCronJob = () => {
    // 매일 자정에 티켓 랭킹 업데이트
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, ticketRankingFunction_1.updateTicketRanking)();
            console.log("Ticket ranking updated successfully");
        }
        catch (error) {
            console.error("Error updating ticket ranking:", error);
        }
    }));
};
exports.startRankingCronJob = startRankingCronJob;
const stopRankingCronJob = () => {
    // Stop the cron job
    node_cron_1.default.stop();
    console.log("Ticket ranking cron job stopped");
};
exports.stopRankingCronJob = stopRankingCronJob;
//# sourceMappingURL=rankingCron.js.map