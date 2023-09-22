import { GroupModel } from "../models/group.model.js";

class GroupController {
  async createGroup(req, res) {
    try {
      const { group_name, avatar, group_link } = req.body;

      const user = req.user;

      if (!group_name) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request",
        });
      }

      const newGroup = await GroupModel.create({
        group_name,
        avatar,
        group_link,
        owner_id: user.id,
      });

      await user.addGroup(newGroup);

      res.status(201).json({
        status: 201,
        data: newGroup,
        message: "CREATED",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("groupController.createGroup: " + error.message);
    }
  }

  async joinGroup(req, res) {
    try {
      const params = +req.params.id;
      const user = req.user;

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

      if (foundUser) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You have already joined to this group",
        });
      }

      await foundGroup.addUsers(user);

      res.status(200).json({
        status: 200,
        data: foundGroup,
        message: "OK",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("groupController.joinGroup: " + error.message);
    }
  }

  async getGroups(req, res) {
    try {
      const user = req.user;

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const offset = (page - 1) * pageSize;

      const groups = await user.getGroups({
        offset,
        limit: pageSize,
      });

      res.status(200).json({
        status: 200,
        data: groups,
        message: "OK",
      });
    } catch (error) {
      console.log("groupController.get: " + error.message);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
    }
  }

  async editGroup(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const { group_name, avatar, group_link } = req.body;

      const foundGroup = await GroupModel.findOne({ where: { id: params } });

      if (!foundGroup) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Group not found",
        });
      }

      if (foundGroup.owner_id !== user.id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You don't have an access to edit this group",
        });
      }

      const updatedGroup = await foundGroup.update({
        group_name,
        avatar,
        group_link,
      });

      res.status(200).json({
        status: 200,
        data: updatedGroup,
        message: "UPDATED",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("groupController.editGroup: " + error.message);
    }
  }

  async deleteGroup(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

      const foundGroup = await GroupModel.findOne({ where: { id: params } });

      if (!foundGroup) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Group not found",
        });
      }

      if (foundGroup.owner_id !== user.id) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "You don't have an access to delete this group",
        });
      }

      await foundGroup.destroy();

      res.status(200).json({
        status: 200,
        message: "Your group has been deleted",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("groupController.deleteGroup: " + error.message);
    }
  }

  async leaveGroup(req, res) {
    try {
      const user = req.user;
      const params = +req.params.id;

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

      await foundGroup.removeUser(foundUser);

      res.status(200).json({
        status: 200,
        message: "You have successfully left the group",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });

      console.log("groupController.leaveGroup: " + error.message);
    }
  }
}

export default new GroupController();
