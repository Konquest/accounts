var config = require('../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid'),
    uid = require('uid2');

var defaultToken = function() {
    return uid(config.oauth2.accessToken.length);
};

var AccessTokenSchema = new Schema({
    token: {type: String, default: defaultToken, index: {unique: true}},
    user: {type: String, ref: 'User'},
    application: {type: String, ref: 'Application'},
    scope: [String],
    expires: {type: Date, default: Date.now, expires: 0}
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);