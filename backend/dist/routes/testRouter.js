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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
/**
 * @swagger
 * tags:
 *   - name: "Test"
 *     description: "Test related routes"
 */
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/test/test1", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.send("ok");
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured.",
        });
    }
}));
exports.testRouter = router;
//# sourceMappingURL=testRouter.js.map