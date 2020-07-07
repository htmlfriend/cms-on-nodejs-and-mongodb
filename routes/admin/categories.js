const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");

router.all("*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Category.find({})
    .then((categories) => {
      res.render("admin/categories/index", { categories: categories });
    })
    .catch((err) => console.log(err));
});

router.post("/create", (req, res) => {
  const newCategory = new Category({
    name: req.body.name,
  });
  newCategory.save().then((savedCategory) => {
    res.redirect("/admin/categories");
  });
});

router.get("/edit/:id", (req, res) => {
  let editId = req.params.id;
  Category.findOne({ _id: editId }).then((category) => {
    res.render("admin/categories/edit", {
      category: category,
    });
  });
});

router.put("/edit/:id", (req, res) => {
  let editId = req.params.id;
  Category.findOne({ _id: editId }).then((category) => {
    category.name = req.body.name;

    category
      .save()
      .then((editCategory) => {
        res.redirect("/admin/categories");
      })
      .catch((err) => console.log(err));
  });
});

router.delete("/delete/:id", (req, res) => {
  let deleteId = req.params.id;
  Category.deleteOne({ _id: deleteId }).then((deleteCategory) => {
    res.redirect("/admin/categories");
  });
});
module.exports = router;
