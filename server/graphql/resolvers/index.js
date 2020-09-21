const UserResolver = require("./users");
const MessageResolver = require("./messages");
module.exports = {
  Message: {
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
};
