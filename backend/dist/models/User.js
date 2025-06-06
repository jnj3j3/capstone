"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_config_1 = require("./db.config");
class User extends db_config_1.seq.Model {
}
exports.User = User;
User.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: db_config_1.seq.STRING,
        unique: true,
    },
    password: {
        type: db_config_1.seq.STRING,
    },
    created: {
        type: db_config_1.seq.DATE,
        defaultValue: db_config_1.seq.NOW,
    },
    state: {
        type: db_config_1.seq.INTEGER,
        defaultValue: 1,
    },
}, {
    modelName: "User",
    tableName: "User",
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true,
});
//# sourceMappingURL=User.js.map