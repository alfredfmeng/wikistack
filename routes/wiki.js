const router = require("express").Router();
const addPage = require("../views/addPage");
const { Page } = require("../models");

router.get("/", (req, res, next) => {
  res.send("This is the GET request for root for wiki.js");
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

router.get("/:slug", (req, res, next) => {
  res.send(`hit dynamic route at ${req.params.slug}`);
});

router.post("/", async (req, res, next) => {
  const { name, title, email, content, status } = req.body;

  try {
    const page = await Page.create({
      title: title,
      content: content,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
