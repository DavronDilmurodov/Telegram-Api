import { UserModel } from "../models/user.model.js";

class UserController {
  async edit(req, res) {
    try {
      // const params = +req.params.id;
      const user = req.user;

      const { avatar, username, first_name, last_name, description } = req.body;

      if (username) {
        const foundUser = await UserModel.findOne({
          where: { username },
        });

        if (foundUser) {
          return res.status(400).json({
            status: 400,
            data: null,
            message: "This username has already taken",
          });
        }
      }

      const updatedUser = await user.update({
        avatar,
        username,
        first_name,
        last_name,
        description,
      });

      res.status(200).json({
        status: 200,
        data: updatedUser,
        message: "UPDATED",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("userController.edit: " + error.message);
    }
  }

  async getInfo(req, res) {
    try {
      const foundUser = req.user;

      res.status(200).json({
        status: 200,
        data: foundUser,
        message: "OK",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("userController.getInfo: " + error.message);
    }
  }
}

export default new UserController();
