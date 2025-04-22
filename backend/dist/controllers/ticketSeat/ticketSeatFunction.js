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
exports.createTicketSeat = createTicketSeat;
exports.deleteTicketSeat = deleteTicketSeat;
exports.findTicketSeatById = findTicketSeatById;
exports.findTicketSeatForUpdate = findTicketSeatForUpdate;
exports.findTicketSeatForCancel = findTicketSeatForCancel;
const index_1 = require("../../models/index");
function createTicketSeat(ticketId, seatNumber, updated, transaction) {
    return index_1.db.TicketSeat.create({
        ticketId: ticketId,
        seatNumber: seatNumber,
        updated: updated,
    }, { transaction });
}
function deleteTicketSeat(seatId, transaction) {
    return index_1.db.TicketSeat.destroy({
        where: {
            id: seatId,
        },
        transaction: transaction,
    });
}
function findTicketSeatById(seatId) {
    return index_1.db.TicketSeat.findOne({
        where: {
            id: seatId,
            state: "available",
        },
    });
}
//find ticketSeat by ticketId and seatNumber for update lock
function findTicketSeatForUpdate(ticketId, seatNumber, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketSeat = yield index_1.db.TicketSeat.findOne({
            where: {
                ticketId: ticketId,
                seatNumber: seatNumber,
                state: "available",
            },
            lock: transaction.LOCK.UPDATE,
            transaction: transaction,
        }).catch((err) => {
            throw new Error(err instanceof Error ? err.message : String(err));
        });
        if (!ticketSeat) {
            throw new Error("Ticket seat not found or already reserved");
        }
        // 결제 시스템을 만들 생각은 아직 없음으로 바로 reserved하게 만들어주었다.
        // 만약 결제 시스템을 만들게 된다면, 이 부분은 놔두고 이 함수를 사용하는 함수에 promise race를 걸어 결제되면 reserved로 바꿔주고
        // 결제 실패시 다시 available로 바꿔주는 로직을 추가해야할듯
        yield index_1.db.TicketSeat.update({
            state: "reserved",
        }, {
            where: {
                ticketId: ticketSeat.ticketId,
                seatNumber: ticketSeat.seatNumber,
                state: "available",
            },
            transaction: transaction,
        }).catch((err) => {
            throw new Error(err instanceof Error ? err.message : String(err));
        });
        // ticketSeat.state = "reserved";으로 업데이트 전 값을 return 시킨다
        return ticketSeat;
    });
}
function findTicketSeatForCancel(seatId, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketSeat = yield index_1.db.TicketSeat.findOne({
            where: {
                id: seatId,
                state: "reserved",
            },
            lock: transaction.LOCK.UPDATE,
            transaction: transaction,
        }).catch((err) => {
            throw new Error(err instanceof Error ? err.message : String(err));
        });
        if (!ticketSeat) {
            throw new Error("Ticket seat not found or already available");
        }
        yield index_1.db.TicketSeat.update({
            state: "available",
        }, {
            where: {
                id: ticketSeat.id,
                state: "reserved",
            },
            transaction: transaction,
        }).catch((err) => {
            throw new Error(err instanceof Error ? err.message : String(err));
        });
        return ticketSeat;
    });
}
//# sourceMappingURL=ticketSeatFunction.js.map