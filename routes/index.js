const path = require("path");
const router = require("express").Router();
const db = require("../model/index");
const userRoutes = require("./user");
const eventRoutes = require("./event")

router.use(userRoutes);

router.use(eventRoutes);

// If API routes dont get hit, send React app

router.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../../client/public/index.html"));
  });

module.exports = router;