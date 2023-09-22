import { UserModel } from "./user.model.js";
import { GroupModel } from "./group.model.js";
import { ChannelModel } from "./channel.model.js";
import { GroupMessageModel } from "./groupMessage.model.js";
import { ChannelMessageModel } from "./channelMessage.model.js";

export const relations = () => {
  UserModel.belongsToMany(GroupModel, {
    through: "user_group_model",
    foreignKey: {
      name: "user_id",
      allowNull: false,
    },
  });

  GroupModel.belongsToMany(UserModel, {
    through: "user_group_model",
    foreignKey: {
      name: "group_id",
      allowNull: false,
    },
  });

  UserModel.belongsToMany(ChannelModel, {
    through: "user_channel_model",
    foreignKey: {
      name: "user_id",
      allowNull: false,
    },
  });

  ChannelModel.belongsToMany(UserModel, {
    through: "user_channel_model",
    foreignKey: {
      name: "channel_id",
      allowNull: false,
    },
  });

  GroupModel.hasMany(GroupMessageModel, { foreignKey: "group_id" });
  GroupMessageModel.belongsTo(GroupModel, { foreignKey: "group_id" });

  ChannelModel.hasMany(ChannelMessageModel, { foreignKey: "channel_id" });
  ChannelMessageModel.belongsTo(ChannelModel, { foreignKey: "channel_id" });
};
