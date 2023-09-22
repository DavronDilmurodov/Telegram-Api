import { GroupModel } from "../models/group.model.js";
import { GroupMessageModel } from "../models/groupMessage.model.js";

class GroupMessageController {
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

      const foundGroup = await GroupModel.findOne({ where: { id: params } });

      if (!foundGroup) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Group not found",
        });
      }

      const users = await foundGroup.getUsers();
      const foundUser = users.find((u) => u.id === user.id);

      if (!foundUser) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "You are not in this group",
        });
      }

      const newMessage = await GroupMessageModel.create({
        message,
        send_by: foundUser.id,
        group_id: foundGroup.id,
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

      const foundMessage = await GroupMessageModel.findOne({
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
      console.log("GroupMessageController.editMessage: " + error.message);
    }
  }

  async deleteMessage(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const foundMessage = await GroupMessageModel.findOne({
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
      console.log("GroupMessageController.deleteMessage: " + error.message);
    }
  }
}

export default new GroupMessageController();
