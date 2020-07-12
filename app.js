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
// passport initialize
const passport = require("passport");
// routers
const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const postsRoutes = require("./routes/admin/posts");
const categoriesRoutes = require("./routes/admin/categories");
const commentsRoutes = require("./routes/admin/comments");
// mongoose.Promise = global.Promise;
const { mongoDbUrl } = require("./config/database");
mongoose
  .connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
// init passport authentication. it's going after session
app.use(passport.initialize());
app.use(passport.session());
//middlewqre of flash
app.use(flash());
//local variables using middleware
app.use((req, res, next) => {
  //change user
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.form_error = req.flash("form_errors");
  res.locals.error = req.flash("error");
  next();
});
app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/posts", postsRoutes);
app.use("/admin/categories", categoriesRoutes);
app.use("/admin/comments", commentsRoutes);

app.listen(3000, () => {
  console.log("I am running on 3000 .....");
});
