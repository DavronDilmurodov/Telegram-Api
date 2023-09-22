import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import channelController from "../controllers/channel.controller.js";
import channelMessageController from "../controllers/channelMessage.controller.js";

export const channelRouter = Router();

channelRouter.post("/", auth, channelController.createChannel);
channelRouter.put("/:id", auth, channelController.joinChannel);
channelRouter.get("/", auth, channelController.getChannels);
channelRouter.put("/edit/:id", auth, channelController.editChannel);
channelRouter.delete("/:id", auth, channelController.deleteChannel);
channelRouter.delete("/leave/:id", auth, channelController.leaveChannel);

// Messages

channelRouter.post("/message/:id", auth, channelMessageController.sendMessage);
channelRouter.put("/message/:id", auth, channelMessageController.editMessage);
channelRouter.delete(
  "/message/:id",
  auth,
  channelMessageController.deleteMessage
);
