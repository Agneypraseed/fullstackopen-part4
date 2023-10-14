const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response
      .status(400)
      .json({ message: "Invalid User", error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response
      .status(401)
      .json({ message: "JSON Token error", error: error.message });
  } else {
    return response.status(500).json({ error: error.message });
  }
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedtoken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedtoken.id) {
    return response
      .status(401)
      .json({ error: "Unauthorised : Token is invalid" });
  }
  request.user = await User.findById(decodedtoken.id);
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
