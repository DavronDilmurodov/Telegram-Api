import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Please, provide token",
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Please, provide correct jwt token",
      });
    }

    const user = await UserModel.findOne({ where: { id: decodedToken.id } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Internal server error",
    });
    console.log(error.message);
  }
};
