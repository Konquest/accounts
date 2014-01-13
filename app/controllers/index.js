// var passport = require('passport');

module.exports.oauth2 = require('./oauth2');
module.exports.session = require('./session');
module.exports.users = require('./users');
module.exports.applications = require('./applications');

module.exports.index = [
    function(req, res) {

        if (req.user) {
            res.render('index');
        } else {
            res.redirect('/session');
        }
    }
];
