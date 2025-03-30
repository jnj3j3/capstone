import express from "express";
import { uploadMiddleware } from "../utils/multer";
import { authMiddleware } from "../utils/authToken";
import { createTicket } from "../controllers/ticket/ticketController";
var router = express.Router();
router.post(
  "/ticket/createTicket",
  uploadMiddleware,
  authMiddleware,
  createTicket
);
export const ticketRouter = router;
