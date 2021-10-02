const router = require("express").Router();
const db = require("../model/index");
const Moment = require("moment");
var nodemailer = require('nodemailer');
const parser = require("../cloudinary/cloudinary");
const cloudinary = require("cloudinary");

// Showing last 5 events on the home page route
router.get("/event", function (req, res) {
    db.Events.find({}).then((response) => {
    

        console.log(response);
        console.log("showing events");
        if (response.length > 5) {
            let lastFive = response.slice(Math.max(response.length - 7, 1));
            res.json(lastFive);
        }
        else {
            res.json(response);
        }
    });
});

// route for to get infp to display
router.get("/event/:id", function (req, res) {
    let id = req.params.id
    db.Events.findById(id)
        .populate("attendees")
        .then((response) => {
            let timeToEvent = Moment(`${response.date} ${response.time}`).fromNow();
            res.json({ fromDB: response, time: timeToEvent });
        });
});


// create new event
router.post("/event", parser.single("image"), function (req, res) {
    console.log("event POST request received");
    let newEvent = {};
    let image = {};

    if (req.file) {
        image.url = req.file.url;
        image.id = req.file.public_id;
    } else {
        image = req.body.image;
    }

    newEvent.name = req.body.name;
    newEvent.address = req.body.address;
    newEvent.date = req.body.date;
    newEvent.time = req.body.time;
    newEvent.description = req.body.description
    newEvent.organizer = req.body.organizer;
    newEvent.image = image;

    // takes the organizer's username to finds its objectId 
    db.Users.findOne({ username: newEvent.organizer })
        .then(response => newEvent.organizerId = response._id)
        .then(response => {
            // creates a new event and pushes its id to the user organizing
            db.Events.create(newEvent)
                .then((dbEvent) => {
                    res.json(dbEvent);
                    return db.Users.findByIdAndUpdate(
                        newEvent.organizerId,
                        { $push: { events: dbEvent._id } },
                        { new: true }
                    )
                })
                .catch(err => res.status(422).json(err))
        })
        .catch(err => console.log(err))

});