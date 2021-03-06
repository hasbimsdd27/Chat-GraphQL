const { ApolloServer } = require("apollo-server");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const { sequelize } = require("./models");
require("dotenv").config();

const contextMiddleware = require("./utils/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`server ready ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
});
