var mongoose = require('mongoose');

module.exports.users = require('./users');
module.exports.clients = require('./clients');
module.exports.authorizationCodes = require('./authorizationCodes');
module.exports.accessTokens = require('./accessTokens');
module.exports.refreshTokens = require('./refreshTokens');

module.exports.init = function(app) {
    mongoose.connect(app.config.db);
};