var oauth2 = require('../oauth2');

module.exports.wip = function(req, res, next) {
    next();
};

module.exports.decision = oauth2.decision();