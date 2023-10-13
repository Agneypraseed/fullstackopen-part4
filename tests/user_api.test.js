const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");

const api = supertest(app);

let initalUserLength;

beforeEach(async () => {
  const passwordHash = await bcrypt.hash("FSpart4", 10);
  const initalUsers = [
    {
      username: "Agney",
      name: "Agney",
      password: passwordHash,
    },
    {
      username: "Relu",
      name: "Lucario",
      password: passwordHash,
    },
  ];
  initalUserLength = initalUsers.length
  await User.deleteMany({});
  await User.insertMany(initalUsers);
});

test("Adding an invalid user returns 400 status code and error message", async () => {
  const invalidUser = {
    username: "Test",
    name: "tester",
  };

  const response = await api
    .post("/api/users")
    .send(invalidUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toBe("Password cannot empty");  
  const usersAfterError = await helper.usersInDb();  
  expect(usersAfterError).toHaveLength(initalUserLength);
});

afterAll(async () => {
  await mongoose.connection.close();
});
