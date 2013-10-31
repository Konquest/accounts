var passport = require('passport');

module.exports.index = function(req, res, next) {
    res.render('session/index');
};

module.exports.login = [
    passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/session'})
];

module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};