import { ChannelModel } from "../models/channel.model.js";
import { ChannelMessageModel } from "../models/channelMessage.model.js";

class ChannelMessageController {
  async sendMessage(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Please, send a message",
        });
      }

      const foundChannel = await ChannelModel.findOne({
        where: { id: params },
      });

      if (!foundChannel) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Channel not found",
        });
      }

      const users = await foundChannel.getUsers();
      const foundUser = users.find((u) => u.id === user.id);

      if (!foundUser) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "You are not in this group",
        });
      }

      if (foundUser.id !== foundChannel.owner_id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You do not have an access to send a message here",
        });
      }

      const newMessage = await ChannelMessageModel.create({
        message,
        send_by: foundUser.id,
        channel_id: foundChannel.id,
      });

      res.status(201).json({
        status: 201,
        data: newMessage,
        message: "Your message has sent",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("channelMessageController.sendMessage: " + error.message);
    }
  }

  async editMessage(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Please, send a message",
        });
      }

      const foundMessage = await ChannelMessageModel.findOne({
        where: { id: params },
      });

      if (!foundMessage) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Message not found",
        });
      }

      if (user.id !== foundMessage.send_by) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "This is not your message",
        });
      }

      const updatedMessage = await foundMessage.update({ message });

      res.status(200).json({
        status: 200,
        data: updatedMessage,
        message: "Your message has been updated",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("channelMessageController.editMessage: " + error.message);
    }
  }

  async deleteMessage(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const foundMessage = await ChannelMessageModel.findOne({
        where: { id: params },
      });

      if (!foundMessage) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Message not found",
        });
      }

      if (foundMessage.send_by !== user.id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "This is not your message",
        });
      }

      await foundMessage.destroy();

      res.status(200).json({
        status: 200,
        message: "Your message has been deleted",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("channelMessageController.deleteMessage: " + error.message);
    }
  }
}

export default new ChannelMessageController();
