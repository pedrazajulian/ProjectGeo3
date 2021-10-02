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

// updating an existing event
router.put("/event/:id", parser.single("image"), function (req, res) {
    db.Events.findById(req.params.id)
        .then(event => {
            // stores current image id event to use in order to delete
            const id = event.image.id;
            let image = {};

            // if a new image is being uploaded to an event, set the image object properties to the new image
            if (req.file) {
                console.log(req.file);
                image.url = req.file.url;
                image.id = req.file.public_id;
                // takes the old stored image id and deletes it from cloudinary storage
                if (id) {
                    cloudinary.v2.uploader.destroy(id, (err, res) => {
                        if (err) console.log(err);
                        console.log("This is the response:" + res)
                    });
                }
            } else {
                image = event.image;
                console.log(image);
            }
            db.Events.findByIdAndUpdate(event._id,
                {
                    $set: {
                        name: req.body.name,
                        address: req.body.address,
                        date: req.body.date,
                        time: req.body.time,
                        description: req.body.description,
                        image: image
                    }
                }, { new: true })
                .then(updatedEvent => {
                    res.json(updatedEvent)
                })
        })
        .catch(err => res.json(err));
});

// deleting an existing event
router.delete("/event/:id", parser.single("image"), function (req, res) {
    let id = req.params.id;
    // User ID needs to be added from the client side
    db.Events.findByIdAndDelete(id)
        .then(event => {
            cloudinary.v2.uploader.destroy(event.image.id, (err, res) => {
                if (err) console.log(err);
                console.log("This is the response:" + res);
            });
            db.Users.findByIdAndUpdate(req.body.userID,
                { $pullAll: { events: [id] } })
                .then(response => {
                    res.json(`${id} has been deleted`);
                })
        })
        .catch(err => res.status(422).json(err));
});