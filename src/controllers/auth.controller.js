import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  async signUp(req, res) {
    try {
      const {
        avatar,
        username,
        password,
        first_name,
        second_name,
        description,
      } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 400,
          data: null,
          msg: "Password and username are required",
        });
      }

      const foundUser = await UserModel.findOne({ where: { username } });

      if (foundUser) {
        return res.status(403).json({
          status: 403,
          data: null,
          message: "This username has already taken",
        });
      }

      const hashedPassword = await bcrypt.hash(String(password), 10);

      const newUser = await UserModel.create({
        avatar,
        username,
        password: hashedPassword,
        first_name,
        second_name,
        description,
      });

      const payload = {
        id: newUser.id,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY);

      res.status(201).json({
        status: 201,
        data: { token },
        message: "User has created successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("authController-signUp: " + error.message);
    }
  }

  async signIn(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 400,
          data: null,
          msg: "Password and username are required",
        });
      }

      const foundUser = await UserModel.findOne({ where: { username } });

      if (!foundUser) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "User with this username not found",
        });
      }

      const unhashedPassword = await bcrypt.compare(
        String(password),
        foundUser.password
      );

      if (!unhashedPassword) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Incorrect email or password",
        });
      }

      const payload = {
        id: foundUser.id,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY);

      res.status(200).json({
        status: 200,
        data: { token },
        message: "You have signed in successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("authController-signIn: " + error.message);
    }
  }

  async changePassword(req, res) {
    try {
      const { password, newPassword } = req.body;

      if (!password || !newPassword) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request",
        });
      }

      const unhashedPassword = await bcrypt.compare(
        String(password),
        req.user.password
      );

      if (!unhashedPassword) {
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Invalid password",
        });
      }

      const newHashedPassword = await bcrypt.hash(String(newPassword), 10);

      await UserModel.update(
        {
          password: newHashedPassword,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      const payload = {
        id: req.user.id,
        is_admin: req.user.is_admin,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY);

      res.status(200).json({
        status: 200,
        data: { token },
        message: "UPDATED",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
      console.log("authController.changePassword: " + error.message);
    }
  }

  async logout(req, res) {
    try {
      const user = req.user;

      await user.destroy();

      res.status(200).json({
        status: 200,
        message: "Your account has been deleted",
      });
    } catch (error) {
      console.log("authController.logout: " + error.message);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal server error",
      });
    }
  }
}

export default new AuthController();
