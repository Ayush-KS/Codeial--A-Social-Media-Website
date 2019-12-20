const passport = require('passport');

const LocalStrategy = require('passport-local');

const User = require('../models/users');


//Authenticating using Passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    
    function(email, password, done) {
        //Find user and establish identity
        User.findOne({
            email: email
        }, function(err, user) {
            if(err) {
                console.log("Error in finding user ---> Passport!");
                return done(err);
            }

            // If user not found or if the password does not match
            if(!user || user.password != password) {
                console.log("Invalid username or password!");
                return done(null, false);
            }
            
            return done(null, user);
        })
    }
));


//Serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done) {
    return done(null, user.id);
})

//Deserialing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err) {
            console.log("Error in finding user ---> Passport!");
            return done(err);
        }
        return done(null, user);
    })
});

passport.checkAuthentication = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    // If user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are just sending 
        // this to locals for views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;