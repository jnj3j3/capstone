"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRanking = void 0;
const db_config_1 = require("./db.config");
class TicketRanking extends db_config_1.seq.Model {
}
exports.TicketRanking = TicketRanking;
TicketRanking.init({
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
        unique: true,
    },
    count: {
        type: db_config_1.seq.INTEGER,
        defaultValue: 0,
    },
    total: {
        type: db_config_1.seq.INTEGER,
        defaultValue: 0,
    },
    rank: {
        type: db_config_1.seq.INTEGER,
        defaultValue: 0,
    },
    updated: {
        type: db_config_1.seq.DATE,
        defaultValue: db_config_1.seq.NOW,
    },
}, {
    modelName: "TicketRanking",
    tableName: "TicketRanking",
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true,
});
//# sourceMappingURL=TicketRanking.js.map