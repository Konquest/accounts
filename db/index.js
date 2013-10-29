var mongoose = require('mongoose');

module.exports.User = require('./user');
module.exports.Application = require('./application');
module.exports.AuthorizationCode = require('./authorizationCode');
module.exports.AccessToken = require('./accessToken');
module.exports.RefreshToken = require('./refreshToken');

module.exports.init = function(app) {
    mongoose.connect(app.config.db);
};