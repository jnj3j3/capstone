"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const testRouter_1 = require("./routes/testRouter");
const models_1 = require("./models");
const userRouter_1 = require("./routes/userRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");
const app = (0, express_1.default)();
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
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(PORT, () => {
    return console.log(`Express is listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map