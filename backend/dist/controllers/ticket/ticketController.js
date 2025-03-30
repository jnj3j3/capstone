"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = createTicket;
const models_1 = require("../../models");
const err_config_1 = require("../../config/err.config");
const Ticket = models_1.db.Ticket;
function createTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const ticket = {
                userId: req.body.id,
                name: req.body.name,
                context: req.body.context,
                image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
            };
            yield Ticket.create(ticket).catch((err) => {
                throw new Error(err);
            });
            res.send("success");
        }
        catch (err) {
            return (0, err_config_1.errConfig)(res, err, "code_board create");
        }
    });
}
//# sourceMappingURL=ticketController.js.map