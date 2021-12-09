const router = require("express").Router();
const addPage = require("../views/addPage");
const { Page } = require("../models");
const { wikiPage, main } = require("../views");

router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) {
    next(error);
  }
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
