const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

router.all("*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Comment.find({ user: req.user.id })
    .populate("user")
    .then((comments) => {
      res.render("admin/comments", {
        comments: comments,
      });
    });
});

router.post("/", (req, res) => {
  const postId = req.body.id;
  Post.findOne({ _id: postId }).then((post) => {
    const newComment = new Comment({
      // user I've got by session
      user: req.user.id,
      body: req.body.body,
    });
    post.comments.push(newComment);
    post.save().then((savedPost) => {
      newComment.save().then((savedComment) => {
        res.redirect(`/post/${post.id}`);
      });
    });
  });
});

router.delete("/:id", (req, res) => {
  const commentId = req.params.id;
  Comment.findByIdAndRemove(commentId).then((comment) => {
    Post.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } },
      (err, data) => {
        if (err) console.log(err);

        res.redirect("/admin/comments");
      }
    );
  });
});
module.exports = router;
