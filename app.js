const express = require("express");
const app = express();
const morgan = require("morgan");
const layout = require("./views/layout");
const { db, Page, User } = require("./models");
const wikiRouter = require("./routes/wiki");
const userRouter = require("./routes/users");

db.authenticate().then(() => {
  console.log("connected to the database");
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/wiki", wikiRouter);
app.use("/user", userRouter);

app.get("/", (req, res, next) => {
  res.redirect("/wiki");
});

const init = async () => {
  db.sync();
  // { force: true }

  const PORT = 1337;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

init();
