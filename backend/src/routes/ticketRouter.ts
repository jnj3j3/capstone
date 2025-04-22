import express from "express";
import { uploadMiddleware } from "../utils/multer";
import { authMiddleware } from "../utils/authToken";
import {
  createTicket,
  pageNationg,
  deleteTicket,
  getTicket,
  getTicketWtihSeats,
} from "../controllers/ticket/ticketController";
var router = express.Router();
router.post(
  "/ticket/createTicket",
  uploadMiddleware,
  authMiddleware,
  createTicket
);
router.get("/ticket/ticketSeat/:ticketId", getTicketWtihSeats);
router.get("/ticket/pageNationg/:page/:limit", pageNationg);
router.delete("/ticket/deleteTicket/:ticketId", authMiddleware, deleteTicket);
router.get("/ticket/getTicket/:ticketId", getTicket);
export const ticketRouter = router;
