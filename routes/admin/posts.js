const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");

router.all("*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({}, function (err, posts) {
    res.render("admin/posts", { posts: posts });
  });
});

router.get("/create", (req, res) => {
  res.render("admin/posts/create");
});

router.post("/create", (req, res) => {
  let allowCommentsProp = true;
  if (req.body.allowComments) {
    allowCommentsProp = true;
  } else {
    allowCommentsProp = false;
  }
  const newPost = new Post({
    title: req.body.title,
    status: req.body.status,
    allowComments: allowCommentsProp,
    body: req.body.body,
  });
  newPost
    .save()
    .then((savedPost) => {
      res.redirect("/admin/posts");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/edit/:id", (req, res) => {
  let postId = req.params.id;
  Post.findOne({ _id: postId }).then((post) => {
    res.render("admin/posts/edit", { post: post });
  });

  router.put("/edit/:id", (req, res) => {
    let postId = req.params.id;
    Post.findOne({ _id: postId }).then((post) => {
      let allowCommentsProp = true;
      if (req.body.allowComments) {
        allowCommentsProp = true;
      } else {
        allowCommentsProp = false;
      }
      post.title = req.body.title;
      post.allowComments = allowCommentsProp;
      post.status = req.body.status;
      post.body = req.body.body;

      post.save().then((editPost) => {
        res.redirect("/admin/posts");
      });
    });
  });
});
module.exports = router;
