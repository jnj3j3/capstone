import express from "express";
import { authMiddleware } from "../utils/authToken";
import {
  reserveTicket,
  cancelReserve,
  getReserveList,
} from "../controllers/reserve/reserveController";
var router = express.Router();
router.post("/reserve/reserveTicket/:ticketId", authMiddleware, reserveTicket);
router.delete(
  "/reserve/cancelReserve/:reserveId",
  authMiddleware,
  cancelReserve
);
router.get("/reserve/getReserveList", authMiddleware, getReserveList);
export const reserveRouter = router;
