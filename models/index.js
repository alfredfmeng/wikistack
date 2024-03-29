const Sequelize = require("sequelize");
const db = new Sequelize("postgres://localhost:5432/wikistack", {
  logging: false,
});

const Page = db.define("page", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("open", "closed"),
  },
});

Page.beforeValidate((page) => {
  if (!page.slug) {
    page.slug = page.title
      .replace(/\s+/g, "_")
      .replace(/\W/g, "")
      .toLowerCase();
  }
});

Page.findByTag = function (search) {
  return Page.findAll({
    include: {
      model: Tag,
      where: {
        name: {
          [Sequelize.Op.substring]: search,
        },
      },
    },
  });
};

Page.prototype.findSimilar = function (tags) {
  return Page.findAll({
    where: {
      id: {
        [Sequelize.Op.ne]: this.id,
      },
    },
    include: {
      model: Tag,
      where: {
        name: {
          [Sequelize.Op.in]: tags,
        },
      },
    },
  });
};

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

const Tag = db.define("tag", {
  name: {
    type: Sequelize.STRING,
  },
});

Page.belongsTo(User, { as: "author" });
User.hasMany(Page, { foreignKey: "authorId" });

Page.belongsToMany(Tag, { through: "page_tags" });
Tag.belongsToMany(Page, { through: "page_tags" });

module.exports = { db, Page, User, Tag };
