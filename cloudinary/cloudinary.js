//  using multer and cloudinary to store user uploaded images
const cloudinary = require("cloudinary");
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();
