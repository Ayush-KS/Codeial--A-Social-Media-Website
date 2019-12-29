const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.create({content: req.body.content, user:req.user});

        post = await post.populate('user', 'name').execPopulate();

        if(req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created!"
            });
        }

    } catch(error) {
        req.flash('error', 'Error in creating post!');
        return res.redirect('/');
    }
}

module.exports.destroy = async function(req, res) {

    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id) {
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                });
            }

        } else {
            return res.redirect('back');
        }
    } catch(error) {
        console.log("Error: ", error);
        return;
    }
}