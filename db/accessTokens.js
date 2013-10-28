var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed;

var AccessTokenSchema = new Schema({
    token: {type: String, required: true, index: {unique: true}},
    user: {type: ObjectId, ref: 'User'},
    client: {type: ObjectId, ref: 'Client'},
    scope: Mixed,
    expires: {type: Date, default: Date.now, expires: 0}
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);