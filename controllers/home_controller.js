const Post = require('../models/posts');
const User = require('../models/users');

module.exports.home = async function(req, res) { 

    try {
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: "comments",
            populate: {
                path: 'user'
            }
        })
        .populate('likes');
        
        let users = await User.find({});
             
        return res.render('home', {
            title: "Home",
            post: posts,
            all_users: users
        });

    } catch (err) {
        console.log(err);
        return;
    }
}