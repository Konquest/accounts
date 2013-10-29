var mongoose = require('mongoose');

module.exports.User = require('./users');
module.exports.Client = require('./clients');
module.exports.AuthorizationCode = require('./authorizationCodes');
module.exports.AccessToken = require('./accessTokens');
module.exports.RefreshToken = require('./refreshTokens');

module.exports.init = function(app) {
    mongoose.connect(app.config.db);
};