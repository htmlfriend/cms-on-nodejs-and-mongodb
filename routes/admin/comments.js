const express = require("express");
const router = express.Router();

router.get("/comments", (req, res) => {
  res.render("comments");
});

module.exports = router;
