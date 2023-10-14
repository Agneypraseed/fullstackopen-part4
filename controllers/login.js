const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response, next) => {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({ username });
    console.log(user.password);
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);    

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const userToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userToken, process.env.SECRET);

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
