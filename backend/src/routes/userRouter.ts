import express from "express";
import {
  checkJwt,
  createUser,
  deleteUser,
  login,
  refreshToken,
} from "../controllers/user/userController";
import { authMiddleware } from "../utils/authToken";
var router = express.Router();
router.post("/user/createUser", createUser);
router.post("/user/login", login);
router.delete("/user/deleteUser", authMiddleware, deleteUser);
router.get("/user/checkToken", authMiddleware, checkJwt);
router.get("/user/refreshToken", refreshToken);
export const userRouter = router;
