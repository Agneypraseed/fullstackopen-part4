const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBLogList) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("the blog list application returns the correct amount of blog posts", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBLogList.length);
});

test("the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

describe("Adding a new Blog", () => {
  let newBlogList;
  const newBlog = {
    title: "Test Blog",
    author: "Agney Chan",
    url: "https://reactpatterns.com/",
    likes: 100,
  };

  beforeAll(async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    newBlogList = await helper.blogsInDb();
  });

  test("creating a new blog post using post request makes the total blog to increase by 1", async () => {
    expect(newBlogList).toHaveLength(helper.initialBLogList.length + 1);
  });

  test("creating a new blog post adds its content correctly to the database.", async () => {
    const blogTitles = newBlogList.map((n) => n.title);
    expect(blogTitles).toContain("Test Blog");
  });
});

test("if the likes property is missing from the request, it will default to the value 0", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Agney Chan",
    url: "https://reactpatterns.com/",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const newBlogList = await helper.blogsInDb();
  const newAddedBlog = { ...newBlog, likes: 0 };
  const { id, ...addedBlogWithoutId } = newBlogList.find(
    (blog) => blog.title === "Test Blog"
  );

  expect(addedBlogWithoutId).toEqual(newAddedBlog);
});

test("if the url property is missing from the request data, the backend return 400 status code", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Agney Chan",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("if the title property is missing from the request data, the backend return 400 status code", async () => {
  const newBlog = {
    author: "Agney Chan",
    url: "LeAgney.ai",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
