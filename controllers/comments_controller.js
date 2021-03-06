const Comment = require('../models/comments');
const Post = require('../models/posts');
const Like = require('../models/likes');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');


module.exports.create = async function(req, res) {

    try{
        let post = await Post.findById(req.body.post)
//        console.log(req.body);
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            
            comment = await comment.populate('user', 'name email').execPopulate();
//            commentsMailer.newComment(comment);
//            console.log(comment);
            
            post.comments.unshift(comment);
            post.save();

            // let job = queue.create('emails', comment).save(function(err) {
            //     if(err) {
            //         console.log("Error in creating queue");
            //     }
            //     console.log(job.id);
            // });

            commentsMailer.newComment(comment);

            if(req.xhr) {
                
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Created!"
                });
            }

        }
    } catch(err) {
        console.log("Error: ", err);
        return res.redirect('/');;
    }
}

module.exports.destroy = async function(req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        
        let postId = comment.post;
        let post = await Post.findById(postId);
        
        if(comment.user == req.user.id || post.user == req.user.id) {

            await Like.deleteMany({likeable: comment, onModel: 'Comment'});

            comment.remove();
            
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}); 

            if(req.xhr) {
//                console.log("XHRRRR CHAL RAHA HAIIII");
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment Deleted!"
                })
            }

            return res.redirect('back');
        } else {
            return res.redirect('back');
        } 
    } catch(err) {
        console.log("Error: ", err);
        return;
    }
}