const express = require("express");
const app = express();
const path = require("path");
const exphbrs = require("express-handlebars");
const mongoose = require("mongoose");

//routers
const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const postsRoutes = require("./routes/admin/posts");

mongoose
  .connect("mongodb://localhost:27017/cms", {
    useMongoClient: true,
    useNewUrlParser: true,
  })
  .then((db) => {
    console.log("Connect to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "hbs",
  exphbrs({
    defaultLayout: "home",
    extname: "hbs",
    // helpers: require("./utils/hbs-helpers"),
    // handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/posts", postsRoutes);

app.listen(3000, () => {
  console.log("I am running on 3000 .....");
});
