var async = require('async'),
    db = require('../../server/models');

module.exports.dummies = require('./dummies');
module.exports.urls = require('./urls');

module.exports.clearData = function(done) {
    async.parallel([
        db.User.remove().remove().exec,
        db.Application.remove().remove().exec,
        db.AuthorizationCode.remove().remove().exec,
        db.AccessToken.remove().remove().exec,
        db.RefreshToken.remove().remove().exec
    ], done);
};
