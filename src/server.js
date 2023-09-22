import express from "express";
import "dotenv/config";
import sequelize from "./db/connection.js";
import { authRouter } from "./routers/auth.router.js";
import { userRouter } from "./routers/user.router.js";
import { relations } from "./models/relation.js";
import { groupRouter } from "./routers/group.router.js";
import { channelRouter } from "./routers/channel.router.js";
// import { UserModel } from "./models/user.model.js";
// import { GroupModel } from "./models/group.model.js";
// import { ChannelModel } from "./models/channel.model.js";
// import { GroupMessageModel } from "./models/groupMessage.model.js";
// import { ChannelMessageModel } from "./models/channelMessage.model.js";

async function bootstrapt() {
  try {
    const app = express();
    app.use(express.json());

    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/group", groupRouter);
    app.use("/channel", channelRouter);

    relations();

    await sequelize.sync({ alter: true });

    app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
      console.log(`Server has run on ${process.env.SERVER_PORT} port`);
    });
  } catch (error) {
    console.log("server.js: ", error.message);
  }
}

bootstrapt();
