var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var User = require('./models/user');
var Task = require("./models/task")
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
console.log("Connecting to db at: " + config.database)
mongoose.connect(config.database);

// apply the JWT strategy to passport
require("./config/passport")(passport);

// bundle up routes for API in a single router
var loginRouter = require("./controllers/login")(passport)

app.use("/login", loginRouter);

var apiRouter = express.Router();

apiRouter.use(passport.authenticate("jwt", {session:false}), function(request, response, next) {
    if (request.headers && request.headers.authorization) {
        tokenParts = request.headers.authorization.split(' ');
        if (tokenParts.length == 2) {
            decodedToken = jwt.decode(tokenParts[1], config.secret);
            User.findOne({name: decodedToken.name}, function(error, user) {
                if (error) {
                    return response.status(500).json({success:false, message: "MongoDB error: " +  error});
                }
                if (!user) {
                    return response.status(403).json({success:false, message: "Failed to authenticate token"});
                } else {
                    request.nodetodo = {};
                    request.nodetodo.token = decodedToken;
                    next();
                }
            });           
        } else {
            return response.status(403).json({success: "false", message:"could not parse authorization header"});
        }
    }
});

apiRouter.get("/user", function(request, response) {
    return response.json({success: true, message:"you are user " + request.nodetodo.token.name, token: request.nodetodo.token });
})

apiRouter.post("/task", function(request, response) {
    if (!request.body.name) return response.status(400).json({success:false, message:"need task name!"})

    var newTask = new Task({
        name: request.body.name
    })
    promise = newTask.save();
    promise.then(function(doc) {
        return response.status(200).json(doc);
    })
})

apiRouter.get("/task", function(request, response) {
    Task.find().then(function(docs) {
        return response.status(200).json(docs);
    })
})

app.use("/api", apiRouter);
app.listen(port);
console.log("server active on port " + port);
