import { ChannelModel } from "../models/channel.model.js";

class ChannelController {
  async createChannel(req, res) {
    try {
      const { channel_name, avatar, channel_link } = req.body;

      if (!channel_name) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request",
        });
      }

      const user = req.user;

      const newChannel = await ChannelModel.create({
        channel_name,
        avatar,
        channel_link,
        owner_id: user.id,
      });

      await user.addChannel(newChannel);

      res.status(201).json({
        status: 201,
        data: newChannel,
        message: "CREATED",
      });
    } catch (error) {
      console.log("channelController.create: " + error.message);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
    }
  }

  async joinChannel(req, res) {
    try {
      const params = +req.params.id;
      const user = req.user;

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

      if (foundUser) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You have already joined to this channel",
        });
      }

      await foundChannel.addUsers(user);

      res.status(200).json({
        status: 200,
        data: foundChannel,
        message: "OK",
      });
    } catch (error) {
      console.log("channelController.joinChannel: " + error.message);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
    }
  }

  async getChannels(req, res) {
    try {
      const user = req.user;

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const offset = (page - 1) * pageSize;

      const channels = await user.getChannels({
        offset,
        limit: pageSize,
      });

      res.status(200).json({
        status: 200,
        data: channels,
        message: "OK",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log(error.message);
    }
  }

  async editChannel(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const { channel_name, avatar, channel_link } = req.body;

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

      if (foundChannel.owner_id !== user.id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You don't have an access to edit this channel",
        });
      }

      const updatedChannel = await foundChannel.update({
        channel_name,
        avatar,
        channel_link,
      });

      res.status(200).json({
        status: 200,
        data: updatedChannel,
        message: "UPDATED",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("channelController.editChannel: " + error.message);
    }
  }

  async deleteChannel(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

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

      if (foundChannel.owner_id !== user.id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You don't have an access to delete this channel",
        });
      }

      await foundChannel.destroy();

      res.status(200).json({
        status: 200,
        message: "Your channel has been deleted",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("channelController.deleteChannel: " + error.message);
    }
  }

  async leaveChannel(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

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
          message: "You are not in this channel",
        });
      }

      await foundChannel.removeUser(foundUser);

      res.status(200).json({
        status: 200,
        message: "You have successfully left the channel",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("channelController.leaveChannel" + error.message);
    }
  }
}

export default new ChannelController();
