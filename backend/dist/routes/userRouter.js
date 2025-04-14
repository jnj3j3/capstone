"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/user/userController");
const authToken_1 = require("../utils/authToken");
var router = express_1.default.Router();
router.post("/user/createUser", userController_1.createUser);
router.post("/user/login", userController_1.login);
router.delete("/user/deleteUser", authToken_1.authMiddleware, userController_1.deleteUser);
router.get("/user/checkToken", authToken_1.authMiddleware, userController_1.checkJwt);
router.get("/user/refreshToken", userController_1.refreshToken);
exports.userRouter = router;
//# sourceMappingURL=userRouter.js.map