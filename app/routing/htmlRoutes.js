var express = require('express');
var path = require("path");
var router = express.Router();

router.get("/", function (req, res) {
    // Sends the home html when the user hits root /
    res.sendFile(path.join(__dirname, "/../public/home.html"));
});

router.get("/survey", function (req, res) {
    // Sends the survey html when the user hits /survey
    res.sendFile(path.join(__dirname, "/../public/survey.html"));
});

module.exports = router;