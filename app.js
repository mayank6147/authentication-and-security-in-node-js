//jshint esversion:6
require("dotenv").config();
const bcrypt = require('bcryptjs');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
/* const encrypt = require("mongoose-encryption"); */
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: "String",
  password: "String",
});
/* comment because now i using md5 */
/* userSchema.plugin(encrypt, {
  secret: process.env.DB_SECRET,
  encryptedFields: ["password"],
}); */


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

app.route('/register')
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        const newUser = new User({
          email: req.body.username,
          password: hash
        });
        newUser.save((err) => {
          if (!err) {
            res.render("secrets");
          }
        });
      });
    });
  });

app.route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = req.body.username;
    const pass = req.body.password;
    console.log(pass);
    User.findOne({
      email: user
    }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          bcrypt.compare(pass, foundUser.password, function (err, compare) {
            console.log(pass);
            console.log(user.password);
            if (!err) {
              if (compare) {
                res.render("secrets");
              }
            }
          });

        }
      }
    });
  });


app.listen(3000, () => {
  console.log("server started at port no 3000");
});
/**/