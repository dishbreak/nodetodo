var express = require('express');

module.exports = function(passport) {
	var loginRouter = express.Router();

	// POST to /login/register to create a new account
	loginRouter.post("/register", function(request, response) {
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

	loginRouter.post("/auth", function(request, response) {
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

	return loginRouter;
}