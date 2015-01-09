var config = require('../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // ObjectId = Schema.Types.ObjectId,
    // Mixed = Schema.Types.Mixed,
    uid = require('uid2');

var defaultToken = function() {
    return uid(config.oauth2.refreshToken.length);
};

var RefreshTokenSchema = new Schema({
    token: {type: String, default: defaultToken, index: {unique: true}},
    user: {type: String, ref: 'User'},
    application: {type: String, ref: 'Application'},
    scope: [String],
    created: {type: Date, default: Date.now},
    expires: {type: Date, default: Date.now, expires: 0}
});

module.exports = mongoose.model('RefreshTokens', RefreshTokenSchema);
