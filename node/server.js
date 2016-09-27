var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var User = require('./models/user');
var port = process.env.PORT || 8080;
var jwt = require('jwt-simple');
var app = express();

// set up parsers for url encoding and JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// log to the console
app.use(morgan('dev'));

// set the 

// use the passport module
app.use(passport.initialize());

app.get('/', function(request, response) {
    response.send('Hi! The application is live.');
});

// connect to the db
mongoose.connect(config.database);

// apply the JWT strategy to passport
require("./config/passport")(passport);

// bundle up routes for API in a single router

var apiRouter = express.Router();

// POST to /api/register to create a new account
apiRouter.post("/register", function(request, response) {
    if (!request.body.name || !request.body.password) {
        response.status(400).json({success: false, message: "request needs username and password"});
    } else {
        var newUser = new User({
            name: request.body.name,
            password: request.body.password
        });

        newUser.save(function (err) {
            if (err) {
                return response.status(403).json({success: false, message: "user already exists in db"});
            }
            response.status(200).json({success: true, message: "Registered new user!"});
        });
    }
});

apiRouter.post("/auth", function(request, response) {
    User.findOne({name: request.body.name}, function(err, user) {
        if (err) throw err;
        if (!user) {
            // used to mask shorter execution time due to user not existing
            // without this, it's easy to tell whether or not a user exists by looking at
            // the request processing time.
            setTimeout(function() {
                response.status(403).json({success: false, message: "Authentication failed: bad username or password"});
            }, 100);
        } else {
            user.comparePassword(request.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // encode the username in a token
                    var token = jwt.encode(user, config.secret);
                    // return the token back to the client
                    response.status(200).json({success: true, token: "JWT " + token});
                } else {
                    response.status(403).json({success: false, message: "Authentication failed: bad username or password"});
                }
            });
        }
    });
});

app.use("/api", apiRouter);

app.listen(port);
console.log("server active on port " + port);
