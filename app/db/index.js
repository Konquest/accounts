var mongoose = require('mongoose'),
    config = require('../../config');

module.exports.User = require('./user');
module.exports.Application = require('./application');
module.exports.AuthorizationCode = require('./authorizationCode');
module.exports.AccessToken = require('./accessToken');
module.exports.RefreshToken = require('./refreshToken');

mongoose.connection.on('error', function() {
    console.error('Could not establish connection.');
});

module.exports.init = function(callback) {
    mongoose.connect(config.db, {auto_reconnect: true}, function(err) {
        console.warn('Mongo connection established.');
        if (callback) callback();
    });
};

module.exports.close = function(callback) {
    mongoose.disconnect(callback);
};
