const router = require("express").Router();
const { User, Page } = require("../models");
const { userList, userPages, notFoundPage } = require("../views");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(userList(users));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Page }],
    });
    if (!user) {
      res.status(404).send(notFoundPage());
    } else {
      res.send(userPages(user, user.pages));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
