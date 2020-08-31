//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: "String",
  password: "String",
});

userSchema.plugin(encrypt, {
  secret: process.env.DB_SECRET,
  encryptedFields: ["password"],
});
const User = new mongoose.model("User", userSchema);
const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set(express.static(__dirname + "/public"));

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save((err) => {
    if (!err) {
      res.render("secrets");
    }
  });
});
app.post("/login", (req, res) => {
  const user = req.body.username;
  const pass = req.body.password;

  User.findOne({ email: user }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === pass) {
          res.render("secrets");
        }
      }
    }
  });
});
app.listen(3000, () => {
  console.log("server started at port no 3000");
});
/**/
