const router = require("express").Router();
const { User } = require("../models");
const { userList } = require("../views");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(userList(users));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = router;
