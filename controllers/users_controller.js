const User = require('../models/users')

module.exports.profile = function(req, res) {
    if(req.cookies.user_id) {
        User.findById(req.cookies.user_id, function(err, user) {
            if(user) {
                return res.render('users_profile', {
                    title: "User Profile",
                    user: user
                });
            }
            return res.redirect('/users/sign-in');
        })
    } else {
        return res.redirect('/users/sign-in');
    }
}

module.exports.signUp = function(req, res) {
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

module.exports.signIn = function(req, res) {
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

module.exports.create = function(req, res) {
    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log("Error in signing up the user!");
            return;
        }

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) {
                    console.log("Error in signing up the user!");
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }
    })   

}

module.exports.createSession = function(req, res) {
    //Finding the user
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log("Error in signing in!");
            return;
        }

        //If user is found
        if(user) {

            //If password doesn't match
            if(user.password != req.body.password) {
                return res.redirect('back');
            }

            //If password matches
            res.cookie('user_id', user._id);
            return res.redirect('./profile');
        } 
        
        //If user is not found
        else {
            return res.redirect('back');
        }
    })
}

module.exports.signOut = function(req, res) {
    req.cookies.user_id = -100;
    return res.redirect('/users/sign-in');
}
