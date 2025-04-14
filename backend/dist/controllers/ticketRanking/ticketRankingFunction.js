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
exports.updateTicketRanking = void 0;
const models_1 = require("../../models");
const updateTicketRanking = () => __awaiter(void 0, void 0, void 0, function* () {
    const [results] = yield models_1.db.sequelize.query(`
    SELECT 
      ts.ticketId, 
      COUNT(CASE WHEN ts.state = 'reserved' THEN 1 END) AS count,
      COUNT(*) AS total
    FROM TicketSeats ts
    GROUP BY ts.ticketId
    ORDER BY count DESC
  `);
    const values = results.map((item, index) => ({
        ticketId: item.ticketId,
        count: item.count,
        total: item.total,
        rank: index + 1,
        updated: new Date(),
    }));
    yield models_1.db.TicketRanking.bulkCreate(values, {
        updateOnDuplicate: ["count", "total", "rank", "updated"],
    });
});
exports.updateTicketRanking = updateTicketRanking;
//# sourceMappingURL=ticketRankingFunction.js.map