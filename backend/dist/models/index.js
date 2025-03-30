"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const db_config_1 = require("./db.config");
const User_1 = require("./User");
const Ticket_1 = require("./Ticket");
exports.db = {
    Sequelize: db_config_1.seq, // 그대로 유지
    sequelize: // 그대로 유지
    db_config_1.sequelize,
    User: User_1.User,
    Ticket: Ticket_1.Ticket,
};
//# sourceMappingURL=index.js.map