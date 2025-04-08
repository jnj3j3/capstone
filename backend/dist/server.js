"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const testRouter_1 = require("./routes/testRouter");
const models_1 = require("./models");
const userRouter_1 = require("./routes/userRouter");
const ticketRouter_1 = require("./routes/ticketRouter");
const reserveRouter_1 = require("./routes/reserveRouter");
const cors_1 = __importDefault(require("cors"));
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = process.env.NODE_DOCKER_PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
models_1.db.sequelize
    .sync()
    .then(() => {
    console.log("Database synchronized successfully.");
})
    .catch((err) => {
    console.error("Error synchronizing database:", err);
});
app.use("", testRouter_1.testRouter);
app.use("", userRouter_1.userRouter);
app.use("", ticketRouter_1.ticketRouter);
app.use("", reserveRouter_1.reserveRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(PORT, () => {
    return console.log(`Express is listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map