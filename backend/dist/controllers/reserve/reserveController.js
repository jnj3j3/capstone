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
exports.reserveTicket = reserveTicket;
exports.cancelReserve = cancelReserve;
exports.getReserveList = getReserveList;
const index_1 = require("../../models/index");
const err_config_1 = require("../../config/err.config");
const ticketSeatFunction_1 = require("../ticketSeat/ticketSeatFunction");
const redisUtils_1 = require("../../utils/redis/redisUtils");
function reserveTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const transaction = yield index_1.db.sequelize.transaction();
        try {
            const ticketId = req.params.ticketId;
            const seatNumber = req.body.seatNumber;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString();
            console.log(typeof ticketId, typeof userId);
            const rank = yield (0, redisUtils_1.getQueueRank)(ticketId, userId);
            if (rank == null || rank >= 10) {
                return res
                    .status(403)
                    .json({ allowed: false, message: "Still in queue" });
            }
            const ticketSeat = yield (0, ticketSeatFunction_1.findTicketSeatForUpdate)(parseInt(ticketId), seatNumber, transaction);
            // 결제시스템이 없음으로 reserve의 state를 바로 reserved로 바꿔주었다.
            // 이후 결제 시스템을 넣고 싶으면 reserve테이블에서 state의 deafult값을 pending으로 두고
            // 결제시스템에서 결제가 완료되면 reserved로 바꿔주는 로직을 추가해야할듯
            const reserve = yield index_1.db.Reserve.create({
                userId: userId,
                seatId: ticketSeat.id,
            }, { transaction });
            yield transaction.commit();
            return res
                .status(200)
                .json({ success: true, message: "Reservation completed" });
        }
        catch (err) {
            yield transaction.rollback();
            return (0, err_config_1.errConfig)(res, err, "this error occurred while reserving the ticket");
        }
    });
}
function cancelReserve(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const transaction = yield index_1.db.sequelize.transaction();
        try {
            const reserveId = parseInt(req.params.reserveId);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const reserve = yield index_1.db.Reserve.findOne({
                where: {
                    id: reserveId,
                    userId: userId,
                    state: "completed",
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction,
            });
            if (!reserve) {
                (0, err_config_1.errConfig)(res, null, "this reserveId is not exist");
            }
            yield (0, ticketSeatFunction_1.findTicketSeatForCancel)(reserve.seatId, transaction).catch((err) => {
                throw new Error(err);
            });
            yield index_1.db.Reserve.update({
                state: "canceled",
                updated: new Date(),
            }, {
                where: {
                    id: reserve.id,
                },
                transaction: transaction,
            });
            yield transaction.commit();
            return res.send("success");
        }
        catch (err) {
            yield transaction.rollback();
            return (0, err_config_1.errConfig)(res, err, "this error occurred while cancelling the reserve");
        }
    });
}
function getReserveList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const reserves = yield index_1.db.Reserve.findAll({
                where: {
                    userId: userId,
                    state: "completed",
                },
                include: [
                    {
                        model: index_1.db.TicketSeat,
                        attributes: ["seatNumber", "updated"],
                        include: [
                            {
                                model: index_1.db.Ticket,
                                attributes: [
                                    "name",
                                    "startDate",
                                    "endDate",
                                    "image",
                                    "price",
                                    "when",
                                ],
                            },
                        ],
                    },
                ],
            });
            return res.send(reserves.map((reserve) => reserve.dataValues));
        }
        catch (err) {
            return (0, err_config_1.errConfig)(res, err, "this error occurred while getting reserve list");
        }
    });
}
//# sourceMappingURL=reserveController.js.map