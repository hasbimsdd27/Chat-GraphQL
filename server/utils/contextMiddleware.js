const jwt = require("jsonwebtoken");

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  return context;
};
