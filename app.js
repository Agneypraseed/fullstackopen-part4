const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const app = express();
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogController");
const usersRouter = require("./controllers/userContoller");
const loginRouter = require("./controllers/login");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
logger.info(`connecting to ${config.MONGODB_URI}`);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.info("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;
