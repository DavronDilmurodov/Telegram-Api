import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

export const ChannelModel = sequelize.define(
  "channels",
  {
    avatar: {
      type: DataTypes.BLOB,
    },

    channel_name: {
      type: DataTypes.STRING,
    },

    channel_link: {
      type: DataTypes.STRING,
    },

    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "channels",
    underscored: true,
    freezeTableName: true,
  }
);
