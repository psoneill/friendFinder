var express = require('express');
var router = express.Router();
var friends = require('../data/friends.js');

router.get("/api/friends", function (req, res) {
    // return JSON Object friends from app/data/friends.js
    return res.json(friends);
});

router.post("/api/friends", function (req, res) {
    friends.push(req.body);
});

module.exports = router;