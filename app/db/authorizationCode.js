var config = require('../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // ObjectId = Schema.Types.ObjectId,
    // Mixed = Schema.Types.Mixed,
    uid = require('uid2');

var defaultCode = function() {
    return uid(config.oauth2.authorizationCode.length);
};

var AuthorizationCodeSchema = new Schema({
    code: {type: String, default: defaultCode, index: {unique: true}},
    user: {type: String, ref: 'User'},
    application: {type: String, ref: 'Application'},
    redirectUri: {type: String, required: true},
    state: String,
    scope: [String],
    created: {type: Date, default: Date.now},
    expires: {type: Date, default: Date.now, expires: 0}    // 10 minutes
});

module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
