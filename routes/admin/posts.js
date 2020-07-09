const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const { userAuthenticated } = require("../../helpers/authentication");

const { isEmpty, uploadDir } = require("../../helpers/ulpoad-helper");

//use middleware useAuthenticated
router.all("*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .populate({ path: "category" })
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    });
});

router.get("/create", (req, res) => {
  Category.find({}).then((categories) => {
    res.render("admin/posts/create", {
      categories: categories,
    });
  });
});

router.post("/create", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      message: "Please add a title",
    });
  }

  if (!req.body.body) {
    errors.push({
      message: "Please add a description",
    });
  }
  if (errors.length > 0) {
    res.render("admin/posts/create", {
      errors: errors,
    });
  } else {
    // render without errors
    let fileName = "";
    if (!isEmpty(req.files)) {
      let file = req.files.file;
      fileName = Date.now() + "-" + file.name;
      let dirUploads = "./public/uploads/";

      file.mv(dirUploads + fileName, (err) => {
        if (err) throw err;
      });
    }

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
      file: fileName,
      category: req.body.category,
    });
    newPost
      .save()
      .then((savedPost) => {
        req.flash(
          "success_message",
          `Post ${savedPost.title} was created successfully`
        );
        res.redirect("/admin/posts");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get("/edit/:id", (req, res) => {
  let postId = req.params.id;
  Post.findOne({ _id: postId }).then((post) => {
    Category.find({}).then((categories) => {
      res.render("admin/posts/edit", { post: post, categories: categories });
    });
  });
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
    post.category = req.body.category;

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      fileName = Date.now() + "-" + file.name;
      post.file = fileName;
      let dirUploads = "./public/uploads/";

      file.mv(dirUploads + fileName, (err) => {
        if (err) throw err;
      });
    }

    post.save().then((editPost) => {
      req.flash(
        "success_message",
        `Post ${editPost.title} was successfully updated`
      );
      res.redirect("/admin/posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (post.file) {
      fs.unlink(uploadDir + post.file, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    post.remove().then((delededPost) => {
      req.flash(
        "success_message",
        `Post ${delededPost.title} was successfully deleded`
      );

      res.redirect("/admin/posts");
    });
  });
});

router.get("/my-posts", (req, res) => {
  res.send(`<h1>This page is under constuction</h1>`);
});
module.exports = router;
