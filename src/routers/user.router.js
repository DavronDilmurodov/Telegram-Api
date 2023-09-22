import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.put("/edit", auth, userController.edit);
userRouter.get("/about", auth, userController.getInfo);
