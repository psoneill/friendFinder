// Dependencies
var express = require("express");
var htmlRoute = require("./app/routing/htmlRoutes.js");
var apiRoute = require("./app/routing/apiRoutes.js");
// Create express app instance.
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

app.use(express.static("app/public"));

app.use('/', htmlRoute);
app.use('/', apiRoute);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});