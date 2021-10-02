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