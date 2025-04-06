"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reserve = void 0;
const db_config_1 = require("./db.config");
class Reserve extends db_config_1.seq.Model {
}
exports.Reserve = Reserve;
Reserve.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: "User",
            key: "id",
        },
    },
    seatId: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: "TicketSeat",
            key: "id",
        },
    },
    created: {
        type: db_config_1.seq.DATE,
        defaultValue: db_config_1.seq.NOW,
    },
    updated: {
        type: db_config_1.seq.DATE,
        defaultValue: db_config_1.seq.NOW,
    },
    state: {
        type: db_config_1.seq.ENUM("pending", "completed", "canceled"),
        defaultValue: "completed",
    },
}, {
    modelName: "Reserve",
    tableName: "Reserve",
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true,
});
//# sourceMappingURL=Reserver.js.map