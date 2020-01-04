module.exports.index = function(req, res) {
    return res.json(200, {
        message: "Another list of posts because this is version 2",
        posts: []
    })
}