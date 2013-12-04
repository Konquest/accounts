var mongoose = require('mongoose'),
    config = require('../config');

module.exports.User = require('./user');
module.exports.Application = require('./application');
module.exports.AuthorizationCode = require('./authorizationCode');
module.exports.AccessToken = require('./accessToken');
module.exports.RefreshToken = require('./refreshToken');

module.exports.init = function() {
    mongoose.connect(config.db, {auto_reconnect: true});
};