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

// posting route in order to create a new user
router.post("/user", parser.single("image"), (req, res) => {
    console.log("api POST request received");
    console.log(req.file);
    const newUser = {};
    let image = {};

    if (req.file) {
        image.url = req.file.url;
        image.id = req.file.public_id;
    } else {
        image = req.body.image
    }

    newUser.username = req.body.username;
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.password = req.body.password;
    newUser.email = req.body.email;
    newUser.image = image;

    // checks if a username or email exists already, if it doesnt a new user is created
    db.Users.findOne({ username: newUser.username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${newUser.username}`
            });
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${req.body.username}`
            });
        }
        else {
            db.Users.findOne({ email: newUser.email }, (err, user) => {
                if (err) {
                    console.log('User.js post error: ', err)
                } else if (user) {
                    res.json({
                        error: `Sorry, already a user with the email: ${newUser.email}`
                    })
                } else {
                    db.Users.create(newUser)
                        .then((response) => res.json(response))
                        .catch(err => res.status(422).json(err));
                }
            });
        }
    });
});

// get a route for specific users by using id's
router.get("/user/:id", (req, res) => {
    console.log(`this is req.params.id ${req.params.id}`)
    db.Users.find({ _id: req.params.id })
        .then(user => res.json(user))
        .catch(err => res.json(err))
});