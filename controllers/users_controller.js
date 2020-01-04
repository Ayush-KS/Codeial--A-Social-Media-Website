const User = require('../models/users');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res) {
    User.findById(req.params.id, function(err, user) {
        return res.render('users_profile', {
            title: "Profile",
            profile_user: user
        });
    });
}

module.exports.update = async function(req, res) {
    // if(req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    //         return res.redirect('back');
    //     });
    // } else {
    //     return res.status(401).send("Unauthorized!");
    // }

    try {
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function(err) {
            if(err) {
                console.log("****MULTER ERROR: ", err);
            }
            
            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file) {

                if(user.avatar) {
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }

                user.avatar = User.avatarPath + '/' + req.file.filename;
            }

            user.save();
            return res.redirect('back');
        })
    } catch {
        req.flash('error', err);
        return res.redirect('back');
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
module.exports.create = async function(req, res) {
    
    try{
        if(req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }

        let user = await User.findOne({email: req.body.email})

        if(!user) {
            await User.create(req.body)
            return res.redirect('/users/sign-in');
        } else {
            console.log("Error in sigsjksjkskjsj!");
            return res.redirect('back');
        }

    } catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

//Sign In: Creating a Session
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/');
}

// Sign Out: Destroying a Session
module.exports.destroySession = function(req, res) {
    req.flash('success', 'You have been logged out!');
    req.logout();
    return res.redirect('/');
}
