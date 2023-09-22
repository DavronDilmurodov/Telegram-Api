import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

export const UserModel = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    avatar: {
      type: DataTypes.BLOB,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING,
    },

    last_name: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "users",
    underscored: true,
    freezeTableName: true,
  }
);
