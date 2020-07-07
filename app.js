const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exphbrs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const mongoose = require("mongoose");
// for put requests
const methodOverride = require("method-override");
// for images - control size and so on
const upload = require("express-fileupload");
// session
const session = require("express-session");
// alert of mistackes
const flash = require("connect-flash");
// routers
const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const postsRoutes = require("./routes/admin/posts");
const categoriesRoutes = require("./routes/admin/categories");
// mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/cms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log("Connect to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname, "public")));

// helper function
const { select, generateTime } = require("./helpers/handlebars-helpers");

// upload Middlware
app.use(upload());

app.engine(
  "hbs",
  exphbrs({
    defaultLayout: "home",
    extname: "hbs",
    helpers: { select: select, generateTime: generateTime },
    // helpers: require("./utils/hbs-helpers"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//method Override for edit post
app.use(methodOverride("_method"));
//middleware of session
app.use(
  session({
    secret: "webserver",
    resave: true,
    saveUninitialized: true,
  })
);

//middlewqre of flash
app.use(flash());
//local variables using middleware
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message");
  next();
});
app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/posts", postsRoutes);
app.use("/admin/categories", categoriesRoutes);

app.listen(3000, () => {
  console.log("I am running on 3000 .....");
});
