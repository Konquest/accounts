var passport = require('passport');

module.exports.index = function(req, res, next) {
    res.render('session/index', {redirectUri: req.session.returnTo});
};

module.exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/login');
        req.login(user, function(err) {
            if (err) return next(err);
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
};

module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};