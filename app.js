const express = require("express");
const app = express();
const morgan = require("morgan");
const { db } = require("./models");
const wikiRouter = require("./routes/wiki");
const userRouter = require("./routes/users");
const methodOverride = require("method-override");

db.authenticate().then(() => {
  console.log("connected to the database");
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use("/wiki", wikiRouter);
app.use("/users", userRouter);

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
