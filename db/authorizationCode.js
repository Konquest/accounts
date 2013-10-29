var config = require('./config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid'),
    uid = require('uid2');

var defaultCode = function() {
    return uid(config.oauth2.authorizationCode.length);
}

var AuthorizationCodeSchema = new Schema({
    code: {type: String, default: defaultCode, index: {unique: true}},
    user: {type: ObjectId, ref: 'User'},
    client: {type: ObjectId, ref: 'Client'},
    redirectUri: {type: String, required: true},
    state: String,
    scope: Mixed,
    expires: {type: Date, default: Date.now, expires: 0}    // 10 minutes
});

module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);