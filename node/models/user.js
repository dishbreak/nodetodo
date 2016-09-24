var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// define the data in the User Schema
var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// make sure to hash the password prior to storage
UserSchema.pre('save', function(next) {
    var user = this;
    // on;y trigger hashing if the user's password has changed
    // or if the user is a new one
    if (this.isModified('password') || this.isNew) {
        // begin by generating a salt
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                //pass any potential errors upstream
                return next(err);
            }
            // use the resulting salt to create a hash
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    //pass any potential errors upstream
                    return next(err);
                }
                // set the password to the hash and call the next operation
                user.password = hash;
                next();
            });
        })        
    } else {
        return next(); // nothing to do
    }
});

// wrapper for bcrypt hash checking of password
UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            // pass any errors to the callback
            return callback(err);
        }
        callback(null, isMatch);
    })
};

// create a user model from this schema
module.exports = mongoose.model('User', UserSchema);