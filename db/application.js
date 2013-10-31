var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');

// Application is synonymous to RFC 6749 Client
var ApplicationSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    name: {type: String, required: true},
    secret: {type: String, default: uuid.v1},
    trusted: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Application', ApplicationSchema);