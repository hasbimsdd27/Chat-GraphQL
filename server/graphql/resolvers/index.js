const UserResolver = require("./users");
const MessageResolver = require("./messages");
const { User, Message } = require("../../models");
module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    message: async (parent) => await Message.findByPk(parent.messageId),
    user: async (parent) =>
      await User.findByPk(parent.userId, {
        attributes: ["username", "imageUrl", "createdAt"],
      }),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...UserResolver.Query,
    ...MessageResolver.Query,
  },
  Mutation: {
    ...UserResolver.Mutation,
    ...MessageResolver.Mutation,
  },
  Subscription: {
    ...MessageResolver.Subscription,
  },
};
