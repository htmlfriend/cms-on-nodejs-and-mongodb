const express = require("express");
const router = express.Router();
const faker = require("faker");
const Post = require("../../models/Post");

router.all("*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.post("/generate-fake-posts", (req, res) => {
  let amount = parseInt(req.body.amount);
  for (let i = 0; i < amount; i++) {
    let post = new Post();
    post.title = faker.name.title();
    post.status = "draft";
    post.allowComments = faker.random.boolean();
    post.body = faker.lorem.sentence();

    post
      .save()
      .then((saveRandom) => {})
      .catch((err) => console.log(err));
  }

  res.redirect("/admin/posts");
});

module.exports = router;
