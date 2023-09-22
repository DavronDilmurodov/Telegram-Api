import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

export const GroupMessageModel = sequelize.define(
  "group_messages",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    send_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "group_messages",
    freezeTableName: true,
    underscored: true,
  }
);
