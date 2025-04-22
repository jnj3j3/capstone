"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = require("../utils/multer");
const authToken_1 = require("../utils/authToken");
const ticketController_1 = require("../controllers/ticket/ticketController");
var router = express_1.default.Router();
router.post("/ticket/createTicket", multer_1.uploadMiddleware, authToken_1.authMiddleware, ticketController_1.createTicket);
router.get("/ticket/ticketSeat/:ticketId", ticketController_1.getTicketWtihSeats);
router.get("/ticket/pageNationg/:page/:limit", ticketController_1.pageNationg);
router.delete("/ticket/deleteTicket/:ticketId", authToken_1.authMiddleware, ticketController_1.deleteTicket);
router.get("/ticket/getTicket/:ticketId", ticketController_1.getTicket);
exports.ticketRouter = router;
//# sourceMappingURL=ticketRouter.js.map