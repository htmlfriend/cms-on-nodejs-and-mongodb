const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");

// bcrypt
const bcrypt = require("bcryptjs");
// passport register
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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

// LOGIN APP
passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    email,
    password,
    done
  ) {
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return done(null, false, { message: "No user found" });
      }
      bcrypt.compare(password, user.password, (err, matched) => {
        if (err) return err;
        if (matched) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    // successFlash: "Welcome",
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

router.post("/register", (req, res) => {
  let errors = [];
  if (!req.body.firstName) {
    errors.push({
      message: "Please add your name",
    });
  }

  if (!req.body.lastName) {
    errors.push({
      message: "Please add your lastname",
    });
  }
  if (!req.body.email) {
    errors.push({
      message: "Please add a email",
    });
  }
  if (!req.body.password) {
    errors.push({
      message: "Please add a password",
    });
  }
  if (!req.body.passwordConfirm) {
    errors.push({
      message: "Please repeat your password",
    });
  }
  if (req.body.password !== req.body.passwordConfirm) {
    errors.push({
      message: "Password fields don't match",
    });
  }
  if (errors.length > 0) {
    res.render("home/register", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  } else {
    User.findOne({ email: req.body.email }).then((isExitUser) => {
      if (!isExitUser) {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;

            newUser
              .save()
              .then((saveUser) => {
                req.flash(
                  "success_message",
                  "you are now registered, please login"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      } else {
        req.flash("error_message", "That email exist please try another email");
        res.redirect("/login");
      }
    });
  }
});

module.exports = router;
