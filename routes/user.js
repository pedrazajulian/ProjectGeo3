const router = require("express").Router();
const db = require("../model");
const passport = require("../passport");
const parser = require("../cloudinary/cloudinary");
const cloudinary = require("cloudinary");

// getting routes for all users
router.get("/user", function (req, res) {
    db.Users.find({})
        .then((response) => res.json(response))
});