"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.dialect = exports.port = exports.DB = exports.PASSWORD = exports.USER = exports.HOST = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.HOST = process.env.DB_HOST;
exports.USER = process.env.MYSQLDB_USER;
exports.PASSWORD = process.env.MYSQLDB_ROOT_PASSWORD;
exports.DB = process.env.MYSQLDB_DATABASE;
exports.port = process.env.MYSQLDB_DOCKER_PORT;
exports.dialect = "mysql";
exports.pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
};
//# sourceMappingURL=db.config.js.map