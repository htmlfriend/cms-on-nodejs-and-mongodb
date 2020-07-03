const express = require("express");
const app = express();
const path = require("path");
const exphbrs = require("express-handlebars");
const mainRoutes = require("./routes/main");
const aboutRoutes = require("./routes/about");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const contactRoutes = require("./routes/contact");
const postRoutes = require("./routes/post");

app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "hbs",
  exphbrs({
    defaultLayout: "main",
    extname: "hbs",
    // helpers: require("./utils/hbs-helpers"),
    // handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use("/", mainRoutes);
app.use("/", aboutRoutes);
app.use("/", loginRoutes);
app.use("/", registerRoutes);
app.use("/", contactRoutes);
app.use("/", postRoutes);

app.listen(3000, () => {
  console.log("I am running on 3000 .....");
});
