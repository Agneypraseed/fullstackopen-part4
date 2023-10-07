const config = require("./utils/config");
const logger = require("./utils/logger");
const Blog = require("./models/blog");
const express = require("express");
const app = express();
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

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
