const Comment = require('../models/comments');
const Post = require('../models/posts');

module.exports.create = function(req, res) {
    Post.findById(req.body.post, function(err, post) {
        if(err) {
            console.log("Error damn1!");
            res.redirect('/');
        }
        if(post) {
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            },
            function(err, comment){
                if(err) {
                    console.log("Error damn2!");
                    res.redirect('/');
                }
                
                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
        }
    });
}

module.exports.destroy = function(req, res) {
    Comment.findById(req.params.id, function(err, comment) {

        let postId = comment.post;

        Post.findById(postId, function(err, post) {
            if(comment.user == req.user.id || post.user == req.user.id) {

                comment.remove();
                
                Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err, post) {
                    return res.redirect('back');
                });
            } else {
                return res.redirect('back');
            } 
        });
    })
}