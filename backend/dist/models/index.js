"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const db_config_1 = require("./db.config");
const User_1 = require("./User");
const Ticket_1 = require("./Ticket");
const Reserver_1 = require("./Reserver");
const TicketSeat_1 = require("./TicketSeat");
const TicketRanking_1 = require("./TicketRanking");
exports.db = {
    Sequelize: db_config_1.seq, // 그대로 유지
    sequelize: // 그대로 유지
    db_config_1.sequelize,
    User: User_1.User,
    Ticket: Ticket_1.Ticket,
    Reserve: Reserver_1.Reserve,
    TicketSeat: TicketSeat_1.TicketSeat,
    TicketRanking: TicketRanking_1.TicketRanking,
};
Reserver_1.Reserve.belongsTo(TicketSeat_1.TicketSeat, { foreignKey: "seatId" });
Reserver_1.Reserve.belongsTo(User_1.User, { foreignKey: "userId" });
TicketSeat_1.TicketSeat.belongsTo(Ticket_1.Ticket, { foreignKey: "ticketId" });
Ticket_1.Ticket.belongsTo(TicketSeat_1.TicketSeat, { foreignKey: "userId" });
TicketRanking_1.TicketRanking.belongsTo(Ticket_1.Ticket, { foreignKey: "ticketId" });
//# sourceMappingURL=index.js.map