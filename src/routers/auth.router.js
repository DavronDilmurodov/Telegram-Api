import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.put("/password", auth, authController.changePassword);
authRouter.delete("/logout", auth, authController.logout);
