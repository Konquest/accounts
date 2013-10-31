var passport = require('passport');

module.exports.oauth2 = require('./oauth2');
module.exports.session = require('./session');
module.exports.users = require('./users');
module.exports.applications = require('./users');

module.exports.index = [
    function(req, res, next) {
        res.render('index');
    }
]
