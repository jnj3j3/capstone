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
exports.createTicket = createTicket;
exports.deleteTicket = deleteTicket;
exports.getTicket = getTicket;
exports.pageNationg = pageNationg;
const index_1 = require("../../models/index");
const err_config_1 = require("../../config/err.config");
const db_config_1 = require("../../models/db.config");
const ticketSeatFunction_1 = require("../ticketSeat/ticketSeatFunction");
const Ticket = index_1.db.Ticket;
function createTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const transaction = yield index_1.db.sequelize.transaction();
        try {
            const body = req.body;
            const ticket = {
                //안정성은 authToken에서 보장해줌줌
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                name: body.name,
                context: body.context,
                image: (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer,
                startDate: body.startDate,
                endDate: body.endDate,
            };
            const createdTicket = yield Ticket.create(ticket, { transaction }).catch((err) => {
                throw new Error(err);
            });
            const seatRows = typeof body.seatRows === "string"
                ? JSON.parse(body.seatRows)
                : body.seatRows;
            for (const seat of seatRows) {
                for (let i = 0; i < parseInt(seat.seats); i++) {
                    yield (0, ticketSeatFunction_1.createTicketSeat)(createdTicket.id, seat.row + i, new Date(), transaction).catch((err) => {
                        throw new Error(err);
                    });
                }
            }
            yield transaction.commit();
            res.send("success");
        }
        catch (err) {
            yield transaction.rollback();
            return (0, err_config_1.errConfig)(res, err, "this error occured while createTicket");
        }
    });
}
function deleteTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const transaction = yield index_1.db.sequelize.transaction();
        try {
            const ticketId = req.params.ticketId;
            const ticket = yield Ticket.findOne({
                where: {
                    id: ticketId,
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction,
            });
            if (!ticket) {
                return res.send("Ticket not found");
            }
            Ticket.destroy({
                where: {
                    id: ticketId,
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                },
                transaction: transaction,
            });
            yield transaction.commit();
            return res.send("success");
        }
        catch (err) {
            yield transaction.rollback();
            return (0, err_config_1.errConfig)(res, err, "this error occured while deleteTicket");
        }
    });
}
function getTicket(req, res) {
    const ticketId = req.params.ticketId;
    Ticket.findOne({
        where: {
            id: ticketId,
        },
    })
        .then((data) => {
        if (data) {
            return res.send(data.dataValues);
        }
        else {
            return res.send("Ticket not found");
        }
    })
        .catch((err) => {
        return (0, err_config_1.errConfig)(res, err, "this error occured while getTicket");
    });
}
function pageNationg(req, res) {
    try {
        const page = parseInt(req.params.page);
        const limit = parseInt(req.params.limit);
        const offset = (page - 1) * limit;
        const searchQuery = req.body.searchQuery;
        if (searchQuery == " " || searchQuery == undefined) {
            Ticket.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [["created", "DESC"]],
                where: {
                    endDate: {
                        [db_config_1.seq.Op.gte]: new Date(),
                    },
                },
            })
                .then((data) => {
                if (data.count == 0) {
                    return res.send("Ticket not found");
                }
                data.rows.map((row) => {
                    row.dataValues;
                });
                return res.send(data);
            })
                .catch((err) => {
                return (0, err_config_1.errConfig)(res, err, "this error occured while getTicket");
            });
        }
        else {
            Ticket.findAndCountAll({
                where: {
                    [db_config_1.seq.Op.and]: [
                        db_config_1.seq.Sequelize.literal(`MATCH(name, content) AGAINST('${searchQuery}' WITH QUERY EXPANSION)`),
                        {
                            endDate: {
                                [db_config_1.seq.Op.gte]: new Date(),
                            },
                        },
                    ],
                },
                //여기서 with query expansion으로 어느정도의 자연어 처리를 해주지만 허점이 많음음
                limit: limit,
                offset: offset,
                order: [["created", "DESC"]],
            })
                .then((data) => {
                if (data.count == 0) {
                    return res.send("Ticket not found");
                }
                data.rows.map((row) => {
                    row.dataValues;
                });
                return res.send(data);
            })
                .catch((err) => {
                return (0, err_config_1.errConfig)(res, err, "this error occured while getTicket");
            });
        }
    }
    catch (err) {
        return (0, err_config_1.errConfig)(res, err, "this error occured while pageNationg");
    }
}
//# sourceMappingURL=ticketController.js.map