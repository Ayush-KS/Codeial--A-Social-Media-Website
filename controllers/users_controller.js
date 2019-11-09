const User = require('../models/users')

module.exports.profile = function(req, res) {
    return res.render('users_profile', {
        title: "Profile"
    });
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

