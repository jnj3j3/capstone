"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSeat = void 0;
const db_config_1 = require("./db.config");
class TicketSeat extends db_config_1.seq.Model {
}
exports.TicketSeat = TicketSeat;
TicketSeat.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticketId: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: "Ticket",
            key: "id",
        },
    },
    seatNumber: {
        type: db_config_1.seq.STRING,
        unique: true,
    },
    updated: {
        type: db_config_1.seq.DATE,
        defaultValue: db_config_1.seq.NOW,
    },
    state: {
        type: db_config_1.seq.ENUM("available", "reserved", "hold"),
        defaultValue: "available",
    },
}, {
    modelName: "TicketSeat",
    tableName: "TicketSeat",
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true,
});
//# sourceMappingURL=TicketSeat.js.map