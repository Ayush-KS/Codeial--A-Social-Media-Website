const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.create = function(req, res) {
    Post.create({content: req.body.content, user:req.user}, function(err, post) {
        if(err) {
            console.log("Error in adding post!");
        }
    })
    return res.redirect('/');
}

module.exports.destroy = function(req, res) {
    
    Post.findById(req.params.id, function(err, post) {
        if(post.user == req.user.id) {
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err) {
                return res.redirect('back');
            });
        } else {
            return res.redirect('back');
        }
    });
}