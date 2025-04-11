import express from "express";
import { getRanking } from "../controllers/ticketRanking/ticketRankingController";
var router = express.Router();

router.get("/ranking/getRanking", getRanking);

export const ticketRankingRouter = router;
