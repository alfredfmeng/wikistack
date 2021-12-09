const router = require("express").Router();
const addPage = require("../views/addPage");
const { Page } = require("../models");
const { wikiPage } = require("../views");

router.get("/", (req, res, next) => {
  res.send("This is the GET request for root for wiki.js");
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

router.get("/:slug", async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const page = await Page.findOne({
      where: {
        slug: slug,
      },
    });
    res.send(wikiPage(page));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, title, email, content, status } = req.body;
  try {
    const page = await Page.create({
      title: title,
      content: content,
    });
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
