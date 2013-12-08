var mongoose = require('mongoose'),
    config = require('../config'),
    connected = false;

module.exports.User = require('./user');
module.exports.Application = require('./application');
module.exports.AuthorizationCode = require('./authorizationCode');
module.exports.AccessToken = require('./accessToken');
module.exports.RefreshToken = require('./refreshToken');

mongoose.connection.on('close', function() {
    connected = false;
});

mongoose.connection.on('open', function() {
    console.log('Mongo connection established.');
    connected = true;
});

mongoose.connection.on('error', function() {
    console.log('Could not establish connection.');
});

module.exports.init = function(callback) {
    if (!connected) {
        mongoose.connect(config.db, {auto_reconnect: true}, callback);
    }
};

module.exports.close = function(callback) {
    mongoose.disconnect(callback);
};
