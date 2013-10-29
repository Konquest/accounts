module.exports.sessions = require('./sessions');
module.exports.users = require('./users');

module.exports.index = function(req, res, next) {
    res.render('index');
};