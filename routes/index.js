const path = require("path");
const router = require("express").Router();
const db = require("../model/index");
const userRoutes = require("./user");
const eventRoutes = require("./event")

router.use(userRoutes);

router.use(eventRoutes);