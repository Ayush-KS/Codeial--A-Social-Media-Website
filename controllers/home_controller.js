const Post = require('../models/posts');
const User = require('../models/users');

module.exports.home = function(req, res) { 

    Post.find({}).populate('user').populate({
        path: "comments",
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){

        User.find({}, function(err, user) {
            return res.render('home', {
                title: "Home",
                post: posts,
                all_users: user
            });
        });
    });
}