require("dotenv").config();
import express from "express";
import { testRouter } from "./routes/testRouter";
import { db } from "./models";
import { userRouter } from "./routes/userRouter";
import { ticketRouter } from "./routes/ticketRouter";
import { reserveRouter } from "./routes/reserveRouter";
import cors from "cors";
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swaggerJson");
const app = express();
app.use(cors());
const PORT = process.env.NODE_DOCKER_PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

app.use("", testRouter);
app.use("", userRouter);
app.use("", ticketRouter);
app.use("", reserveRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
