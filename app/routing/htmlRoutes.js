var express = require('express');
var path = require("path");
var router = express.Router();

router.get("/", function (req, res) {
    // Finally we send the user the HTML file we dynamically created.
    res.sendFile(path.join(__dirname, "/../public/home.html"));
});

router.get("/survey", function (req, res) {
    // Finally we send the user the HTML file we dynamically created.
    res.sendFile(path.join(__dirname, "/../public/survey.html"));
});

module.exports = router;