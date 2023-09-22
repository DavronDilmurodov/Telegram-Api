import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import groupController from "../controllers/group.controller.js";
import groupMessageController from "../controllers/groupMessage.controller.js";

export const groupRouter = Router();

groupRouter.post("/", auth, groupController.createGroup);
groupRouter.put("/:id", auth, groupController.joinGroup);
groupRouter.get("/", auth, groupController.getGroups);
groupRouter.put("/edit/:id", auth, groupController.editGroup);
groupRouter.delete("/:id", auth, groupController.deleteGroup);
groupRouter.delete("/leave/:id", auth, groupController.leaveGroup);

// Messages

groupRouter.post("/message/:id", auth, groupMessageController.sendMessage);
groupRouter.put("/message/:id", auth, groupMessageController.editMessage);
groupRouter.delete("/message/:id", auth, groupMessageController.deleteMessage);
