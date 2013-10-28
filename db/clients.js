var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed;

var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var guid = function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};


var ClientSchema = new Schema({
    name: {type: String, required: true, index: {unique: true}},
    secret: {type: String, default: guid},
    trusted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Client', ClientSchema);