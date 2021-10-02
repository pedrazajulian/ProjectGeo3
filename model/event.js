var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EventSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true,
    },

    date: {
        type: String,
        required: true,
    },

    time: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        url: {
            type: String,
            required: false,
            default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
        },
        id: {
            type: String,
            required: false
        }
    },

    organizer: {
        type: String,
        required: true
    },

    organizerId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    attendees: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
    }]

});

//create compound index with following three fields
EventSchema.index({name: "text", description: "text", address: "text"});

// make model from event schema
var Events = mongoose.model("Events", EventSchema);

module.exports = Events;