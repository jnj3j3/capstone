"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const db_config_1 = require("./db.config");
class Ticket extends db_config_1.seq.Model {
}
exports.Ticket = Ticket;
Ticket.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: db_config_1.seq.STRING,
    },
    created: {
        type: db_config_1.seq.DATE,
    },
    context: {
        type: db_config_1.seq.STRING,
    },
    image: {
        type: db_config_1.seq.BLOB("long"),
    },
    userId: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: "User",
            key: "id",
        },
    },
    startDate: {
        type: db_config_1.seq.DATE,
    },
    endDate: {
        type: db_config_1.seq.DATE,
    },
    when: {
        type: db_config_1.seq.DATE,
    },
    price: {
        type: db_config_1.seq.INTEGER,
    },
}, {
    modelName: "Ticket",
    tableName: "Ticket",
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true,
});
//# sourceMappingURL=Ticket.js.map