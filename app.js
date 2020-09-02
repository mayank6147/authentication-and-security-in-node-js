//jshint esversion:6
require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const { Passport } = require("passport");
const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/*app.set(express.static(__dirname + "/public"));*/

app.use(express.static("public"));

app.use(
  session({
    resave: false,
    secret: "keyboard cat",
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema({
  email: "String",
  password: "String",
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//const User = require('./models/user');

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (
      err,
      user
    ) {
      if (err) {
        console.log(err);
        res.render("register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    });
  });

app.route("/secrets").get(function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res) {

  req.logout();
  res.redirect("/");
});
app.listen(3000, () => {
  console.log("server started at port no 3000");
});
/**/
