var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');
    
var ClientSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    name: {type: String, required: true},
    secret: {type: String, default: uuid.v1},
    trusted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Client', ClientSchema);