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

describe("Getting all the blogs", () => {
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

    const newBlogList = await helper.blogsInDb();
    expect(newBlogList).toHaveLength(helper.initialBLogList.length);
  });

  test("if the title property is missing from the request data, the backend return 400 status code", async () => {
    const newBlog = {
      author: "Agney Chan",
      url: "LeAgney.ai",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const newBlogList = await helper.blogsInDb();
    expect(newBlogList).toHaveLength(helper.initialBLogList.length);
  });
});

describe("Deleting a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogToDelete = helper.initialBLogList[0];

    await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204);

    const blogesAfter = await helper.blogsInDb();

    expect(blogesAfter).toHaveLength(helper.initialBLogList.length - 1);

    const titles = blogesAfter.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("gives with status code 400 if id is malinformed", async () => {
    const malinformedId = "6526f113a68264af80977e9";

    await api.delete(`/api/blogs/${malinformedId}`).expect(400);

    const blogesAfter = await helper.blogsInDb();

    expect(blogesAfter).toHaveLength(helper.initialBLogList.length);
  });
});

describe("Updating a blog", () => {
  test("update the number of likes for a blog given the right id and the new number of likes updates the count of likes in the original blog", async () => {
    const blogToUpdate = helper.initialBLogList[0];
    const newlikes = {
      likes: 300,
    };
    const result = await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(newlikes)
      .expect(200);
    console.log(result);
    expect(result.body.likes).toEqual(newlikes.likes);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
