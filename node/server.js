var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var user = require('./models/user');
var port = process.env.PORT || 8080;
var jwt = require('jwt-simple');
var app = express();

// set up parsers for url encoding and JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// log to the console
app.use(morgan('dev'));

// use the passport module
app.use(passport.initialize());

app.get('/', function(request, response) {
    response.send('Hi! The application is live.');
});

app.listen(port);
console.log("server active on port " + port);
