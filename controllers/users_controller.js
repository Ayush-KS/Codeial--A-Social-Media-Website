const User = require('../models/users')

module.exports.profile = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        return res.render('users_profile', {
            title: "Profile",
            profile_user: user
        });
    });
}

module.exports.update = function(req, res) {
    if(req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            return res.redirect('back');
        });
    } else {
        return res.status(401).send("Unauthorized!");
    }
}

module.exports.signUp = function(req, res) {

    //Preventing a signed in user from accessing this page
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

module.exports.signIn = function(req, res) {

    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// Sign Up: Creating a user
module.exports.create = function(req, res) {
    console.log(req.body);
    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user) {
        
        if(err) {
            console.log("Error in signing up the user!");
            return;
        }

        if(!user) {
            console.log(req.body.email);
            User.create(req.body, function(err, user) {
                if(err) {
                    console.log("Error in signing up the user!");
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        } else {
            console.log("Error in sigsjksjkskjsj!");
            return res.redirect('back');
        }
    })   
}

//Sign In: creating a session
module.exports.createSession = function(req, res) {
    return res.redirect('/');
}

// Sign Out: Destroying a session
module.exports.destroySession = function(req, res) {
    req.logout();
    return res.redirect('/');
}