import express from "express";
import { getRanking } from "../controllers/ticketRanking/ticketRankingController";
import { uploadMiddleware } from "../utils/multer";
var router = express.Router();

router.get("/ranking/getRanking", uploadMiddleware, getRanking);

export const ticketRankingRouter = router;
