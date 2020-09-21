const { User, Message } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getMessages: async (_, { from }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        const sender = await User.findOne({
          where: { username: from },
        });

        if (!sender) throw new UserInputError("User not found");

        const usernames = [user.username, sender.username];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });

        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const recepient = await User.findOne({ where: { username: to } });

        if (!recepient) {
          throw new UserInputError("User not found");
        } else if (recepient.username === user.username) {
          throw new UserInputError("You cant message yourself");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
