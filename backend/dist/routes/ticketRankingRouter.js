"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRankingRouter = void 0;
const express_1 = __importDefault(require("express"));
const ticketRankingController_1 = require("../controllers/ticketRanking/ticketRankingController");
const multer_1 = require("../utils/multer");
var router = express_1.default.Router();
router.get("/ranking/getRanking", multer_1.uploadMiddleware, ticketRankingController_1.getRanking);
exports.ticketRankingRouter = router;
//# sourceMappingURL=ticketRankingRouter.js.map