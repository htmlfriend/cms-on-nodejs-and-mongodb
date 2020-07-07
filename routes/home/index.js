const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");

router.all("*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .then((posts) => {
      Category.find({}).then((categories) => {
        res.render("home/index", {
          posts: posts,
          categories: categories,
        });
      });
    })
    .catch((err) => console.log(err));
});

router.get("/post/:id", (req, res) => {
  let postId = req.params.id;
  Post.findOne({ _id: postId })
    .then((post) => {
      Category.find({}).then((categories) => {
        res.render("home/post", {
          post: post,
          categories: categories,
        });
      });
    })
    .catch((err) => console.log(err));
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});
module.exports = router;
