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

// route to update the user info
router.put("/user/:id", parser.single("image"), (req, res) => {
    db.Users.findById(req.params.id)
        .then(user => {
            const id = user.image.id;
            let image = {};

            // if uploads a new image, set image object properties to new image
            if (req.file) {
                console.log(req.file);
                image.url = req.file.url;
                image.id = req.file.public_id;
                // takes old stored image id,then deletes it from cloudinary storage
                if (id) {
                    cloudinary.v2.uploader.destroy(id, (err, res) => {
                        if(err) console.log(err);
                        console.log("This is the response:" + res)
                    });
                }
                // if user isnt uploading a new image then set the new image object to current image object
            } else {
                image = user.image;
                console.log(image);
            }
            db.Users.findByIdAndUpdate(user._id, {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password,
                    image: image
                }
            }, { new: true })
                .then(updatedUser => res.json(updatedUser))
        })
        .catch(err => res.json(err));
});

// get route to get all of the events a user is attending or organizing
router.get("/user/:id/myevents", (req, res) => {
    db.Users.find({ _id: req.params.id })
        .populate("events")
        .then(user => res.json(user))
        .catch(err => res.json(err))
});

// post route to create a new login session
router.post('/login', (req, res, next) => {
    console.log('routes/user.js, login, req.body: ');
    console.log(req.body)
    next()
},
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            id: req.user._id,
            username: req.user.username,
            image: req.user.image.url
        };
        res.send(userInfo);
    }
);