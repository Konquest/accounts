var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    bcrypt = require('bcrypt'),
    uuid = require('node-uuid'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true}},
    roles: {type: [String], default: ['user']}
});

UserSchema.pre('save', function(next) {
    var user = this;
    
    if (!user.isModified('password')) return next(); // only hash the password if it has been modified (or is new)

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) { // hash the password using our new salt
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
