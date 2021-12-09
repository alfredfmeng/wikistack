const express = require("express");
const app = express();
const morgan = require("morgan");
const layout = require("./views/layout");
const { db, Page, User } = require("./models");

db.authenticate().then(() => {
  console.log("connected to the database");
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.send(layout(""));
});

const init = async () => {
  db.sync({ force: true });

  const PORT = 1337;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

init();
