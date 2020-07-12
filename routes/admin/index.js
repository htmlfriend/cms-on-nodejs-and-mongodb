const express = require("express");
const router = express.Router();
const faker = require("faker");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

const { userAuthenticated } = require("../../helpers/authentication");
const Category = require("../../models/Category");
const User = require("../../models/User");
//for defeding router use middleware userAuthenticated
router.all("*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  // data for chartjs in the first row
  Post.estimatedDocumentCount({}).then((postCount) => {
    Comment.estimatedDocumentCount({}).then((countComment) => {
      Category.estimatedDocumentCount({}).then((countCategory) => {
        User.estimatedDocumentCount({}).then((countUser) => {
          res.render("admin/index", {
            postCount: postCount,
            countComment: countComment,
            countCategory: countCategory,
            countUser: countUser,
          });
        });
      });
    });
  });
});

router.post("/generate-fake-posts", (req, res) => {
  let amount = parseInt(req.body.amount);
  for (let i = 0; i < amount; i++) {
    let post = new Post();
    post.title = faker.name.title();
    post.status = "draft";
    post.allowComments = faker.random.boolean();
    post.body = faker.lorem.sentence();
    post.slug = faker.name.title();
    post
      .save()
      .then((saveRandom) => {})
      .catch((err) => console.log(err));
  }

  res.redirect("/admin/posts");
});

module.exports = router;
