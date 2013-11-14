var passport = require('passport');

module.exports.index = function(req, res, next) {
    res.render('session/index', {redirectUri: req.session.returnTo});
};

module.exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('error', 'Incorrect Username/Password');
            return res.render('/session/index');
        }
        req.login(user, function(err) {
            if (err) return next(err);

            var redirect = req.query.redirect || req.body.redirect || '/users/' + user.username;
            return res.redirect(redirect);
        });
    })(req, res, next);
};

module.exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};