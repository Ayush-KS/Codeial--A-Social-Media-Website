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

module.exports.destroy = async function(req, res) {
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id) {
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch(error) {
        console.log("Error: ", error);
        return;
    }
}