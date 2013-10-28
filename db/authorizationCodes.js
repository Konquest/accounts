var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed;

var AuthorizationCodeSchema = new Schema({
    code: {type: String, required: true, index: {unique: true}},
    user: {type: ObjectId, ref: 'User'},
    client: {type: ObjectId, ref: 'Client'},
    redirectUri: {type: String, required: true},
    state: String,    // Required by RFC 6749, but leaving it optional since we don't necessarily use it
    scope: Mixed,
    expires: {type: Date, default: Date.now, expires: 0}    // 10 minutes
});

module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);