const router = require("express").Router();
const addPage = require("../views/addPage");
const { Page, User } = require("../models");
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

    if (!page) {
      res.status(404).send("Looks like this page doesn't exist");
    } else {
      const author = await page.getAuthor();
      res.send(wikiPage(page, author));
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, title, email, content, status } = req.body;
  try {
    const [user, created] = await User.findOrCreate({
      where: {
        name: name,
        email: email,
      },
    });

    const page = await Page.create({
      title: title,
      content: content,
    });

    await page.setAuthor(user);

    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
