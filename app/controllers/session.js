var passport = require('passport');

module.exports.index = function(req, res) {
    if (req.user) {
        res.redirect('/users/' + req.user.username);
    } else {
        req.session.redirect = req.query.redirect;
        res.render('session/index', {user: {}, redirectUri: req.session.redirect});
    }
};

module.exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) return next(err);
        if (!user) {
            req.flashNow('error', 'Incorrect Username/Password');
            return res.render('session/index', {user: req.body});
        }
        req.login(user, function(err) {
            if (err) return next(err);

            var redirect = req.session.redirect || '/users/' + user.username;
            return res.redirect(redirect);
        });
    })(req, res, next);
};

module.exports.logout = function (req, res) {
    req.flash('error', 'Successfully logged out');
    req.logout();
    res.redirect('/');
};
