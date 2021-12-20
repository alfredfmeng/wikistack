const router = require("express").Router();
const addPage = require("../views/addPage");
const { Page, User, Tag } = require("../models");
const { wikiPage, main, editPage, notFoundPage } = require("../views");

// GET '/'
router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) {
    next(error);
  }
});

// GET '/add'
router.get("/add", (req, res, next) => {
  res.send(addPage());
});

// GET '/:slug'
router.get("/:slug", async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const page = await Page.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: User,
          as: "author",
        },
        {
          model: Tag,
        },
      ],
    });
    if (!page) {
      res.status(404).send(notFoundPage());
    } else {
      res.send(wikiPage(page, page.author, page.tags));
    }
  } catch (error) {
    next(error);
  }
});

// GET '/:slug/edit'
router.get("/:slug/edit", async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const page = await Page.findOne({
      where: {
        slug: slug,
      },
      include: {
        model: User,
        as: "author",
      },
    });
    if (!page) {
      res.status(404).send("Looks like this page doesn't exist");
    } else {
      res.send(editPage(page, page.author));
    }
  } catch (error) {
    next(error);
  }
});

// DELETE '/:slug'
router.delete("/:slug", async (req, res, next) => {
  const slug = req.params.slug;
  try {
    await Page.destroy({
      where: {
        slug: slug,
      },
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// POST '/'
router.post("/", async (req, res, next) => {
  const { name, title, email, content, status, tag } = req.body;
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

    const tagList = tag.split(" ");
    const tags = await Promise.all(
      tagList.map(async (tagName) => {
        const [tag, wasCreated] = await Tag.findOrCreate({
          where: {
            name: tagName,
          },
        });
        return tag;
      })
    );

    await page.addTags(tags);

    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

// PUT '/:SLUG'
router.put("/:slug", async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const [updatedRowcount, updatedPages] = await Page.update(req.body, {
      where: {
        slug: slug,
      },
      returning: true,
    });

    res.redirect("/wiki/" + updatedPages[0].slug);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
