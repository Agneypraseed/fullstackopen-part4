const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json("Title and URL cannot be empty");
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndRemove(request.params.id);
    if (result) response.status(204).end();
    response.status(400).json("Id doesnot exist");
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const updatedBlog = {
    likes: request.body.likes,
  };

  try {
    const res = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
      new: true,
    });
    if (res) response.status(200).json(res);
    response.status(400).json("Invalid Id");
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
