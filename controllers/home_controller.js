module.exports.home = function(req, res) {
    return res.end('<h1>Express is up and running!</h1>');
}

module.exports.home2 = function(req, res) {
    return res.end('<h1>Yet another page!</h1>');
}