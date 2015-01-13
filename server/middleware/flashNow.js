module.exports = function(req, res, next) {
    if (req.user) res.locals.currentUser = req.user;

    res.locals.flash = req.flash();
    req.flashNow = function(type, msg) {
        res.locals.flash[type] = msg;
    };

    return next();
};
