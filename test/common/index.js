var async = require('async'),
    db = require('../../').db;

module.exports.dummies = require('./dummies');
module.exports.urls = require('./urls');

module.exports.clearData = function(done) {
    async.parallel([
        db.User.remove().exec,
        db.Application.remove().exec,
        db.AuthorizationCode.remove().exec,
        db.AccessToken.remove().exec,
        db.RefreshToken.remove().exec
    ], function() {
        console.log('Cleared data');

        db.User.find(function(err, users) {
            console.log('User count: ' + users.length);
        });
        done();
    });
};