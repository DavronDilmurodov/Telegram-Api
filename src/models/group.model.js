import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

export const GroupModel = sequelize.define(
  "groups",
  {
    avatar: {
      type: DataTypes.BLOB,
    },

    group_name: {
      type: DataTypes.STRING,
    },

    group_link: {
      type: DataTypes.STRING,
    },

    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "groups",
    underscored: true,
    freezeTableName: true,
  }
);
