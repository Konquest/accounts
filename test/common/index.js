var async = require('async'),
    db = require('../../server/models');

module.exports.urls = {
    logout: '/session/logout',
    home: '/',
    users: '/users',
    userForm: '/users/new',
    profile: function(username) {
        return '/users/' + username;
    },
    session: '/session'
};

module.exports.clearData = function(done) {
    async.parallel([
        db.User.remove().remove().exec,
        db.Application.remove().remove().exec,
        db.AuthorizationCode.remove().remove().exec,
        db.AccessToken.remove().remove().exec,
        db.RefreshToken.remove().remove().exec
    ], done);
};
