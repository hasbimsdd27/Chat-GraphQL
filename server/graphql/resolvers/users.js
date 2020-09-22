const { User, Message } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: { username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must be not be empty";
        if (password === "") errors.username = "password must be not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad Input", { errors });
        }
        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        if (await argon2.verify(user.password, password)) {
          const token = jwt.sign(
            {
              username,
            },
            process.env.JWT_SECRET_ACCESS,
            { expiresIn: "1h" }
          );

          return {
            ...user.toJSON(),
            token,
          };
        } else {
          errors.username = "password is incorect";
          throw new UserInputError("password is incorect", { errors });
        }
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        if (email.trim() === "") {
          errors.email = "email must not be empty";
        }
        if (username.trim() === "") {
          errors.username = "username must not be empty";
        }
        if (password.trim() === "") {
          errors.password = "password must not be empty";
        }
        if (confirmPassword.trim() === "") {
          errors.confirmPassword = "repeat password must not be empty";
        }

        if (password !== confirmPassword) {
          errors.confirmPassword = "Password mismatch";
        }

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        const user = await User.create({
          username,
          email,
          password: await argon2.hash(password),
        });

        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (item) => (errors[item.path] = `${item.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((item) => (errors[item.path] = item.message));
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
  },
};
