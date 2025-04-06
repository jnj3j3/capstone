"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reserveRouter = void 0;
const express_1 = __importDefault(require("express"));
const authToken_1 = require("../utils/authToken");
const reserveController_1 = require("../controllers/reserve/reserveController");
var router = express_1.default.Router();
router.post("/reserve/reserveTicket/:ticketId", authToken_1.authMiddleware, reserveController_1.reserveTicket);
router.delete("/reserve/cancelReserve/:reserveId", authToken_1.authMiddleware, reserveController_1.cancelReserve);
exports.reserveRouter = router;
//# sourceMappingURL=reserveRouter.js.map