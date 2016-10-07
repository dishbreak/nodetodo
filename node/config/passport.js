var JwtStrategy = require("passport-jwt").Strategy;

// obtain the user model
var User = require("../models/user");
var databaseConfig = require("../config/database");

// this function will take in our passport argument and direct it to use
// the following strategy for determining authentication
module.exports = function(passport) {
    var options = {};
    options.secretOrKey = databaseConfig.secret;
    options.passReqToCallBack = true;
    passport.use(new JwtStrategy(options, function(jwtPayload, done) {
        User.findOne({id: jwtPayload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};