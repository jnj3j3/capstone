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
exports.getRanking = getRanking;
const models_1 = require("../../models");
const err_config_1 = require("../../config/err.config");
function getRanking(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ranking = yield models_1.db.TicketRanking.findAll({
                limit: 5,
                order: [["rank", "ASC"]],
                include: [
                    {
                        model: models_1.db.Ticket,
                        as: "ticket",
                        attributes: ["name", "startDate", "endDate", "image"],
                    },
                ],
            });
            return res.send(ranking.map((ticket) => {
                ticket.dataValues;
            }));
        }
        catch (err) {
            return (0, err_config_1.errConfig)(res, err, "this error occurred while getting ranking");
        }
    });
}
//# sourceMappingURL=ticketRankingController.js.map