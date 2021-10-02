const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes = require("./routes");
const session = require("express-session");
const passport = require("./passport");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
const PORT = process.env.PORT || 3001;

// Connect to the Mongo DB to deploy heroku

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/crowfunding";
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true },
  console.log("Connected to MongoDB!")
);

// Definition of middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }