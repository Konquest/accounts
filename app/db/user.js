var __ = require('underscore'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // ObjectId = Schema.Types.ObjectId,
    // Mixed = Schema.Types.Mixed,
    bcrypt = require('bcrypt'),
    uuid = require('node-uuid'),
    isArray = require('util').isArray,
    SALT_WORK_FACTOR = 10;

// Definition
var ContactSchema = new Schema({
    active: {type: Boolean, default: true},
    channel: {type: String, required: true, enum: ['email']},
    uri: {type: String, required: true, index: {unique: true}},
    verificationCode: {type: String},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

var UserSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    active: {type: Boolean, default: true},
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, default: '', index: {unique: true}},            // Primary email
    contacts: {type: [ContactSchema], default: []},
    roles: {type: [String], default: ['user']},
    applications: {type: [String], ref: 'Application', default: []},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

UserSchema.roles = ['user', 'admin'];

// Validation
UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'must be an email address');

UserSchema.path('username').validate(function (username) {
    return (username || '').length >= 3;
}, 'must be 3 characters or more');

UserSchema.path('password').validate(function (password) {
    return (password || '').length >= 4;
}, 'must be 4 characters or more');

UserSchema.path('roles').validate(function(roles) {
    return roles.length > 0;
}, 'must have at least one role');

UserSchema.path('roles').validate(function(roles) {
    var possibleRoles = UserSchema.roles,
        valid = true;

    roles.forEach(function(role) {
        if (possibleRoles.indexOf(role) === -1) {
            valid = false;
        }
    });

    return valid;
}, 'must be valid roles - ' + UserSchema.roles.join(', '));

// Operational
UserSchema.pre('validate', function(next) {
    if (this.isModified('email')) {
        var contact = {
            channel: 'email',
            uri: this.email
        };
        this.contacts.push(contact);
    }

    next();
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next(); // only hash the password if it has been modified (or is new)

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) { // hash the password using our new salt
            if (err) return next(err);

            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
};

UserSchema.methods.normalize = function() {
    return __.pick(this.toJSON({getters: true}), 'id', 'name', 'username');
};

UserSchema.methods.isA = function(role) {
    return ~UserSchema.roles.indexOf(role);
};

// TODO: Refracter out to a separate library - https://trello.com/c/YBKLuFBU/8-extract-user-table-migration-to-an-external-library
UserSchema.statics.migrate = function(models) {
    var update = function(model) {
        var changed = false;

        Object.keys(UserSchema.tree).forEach(function(fieldName) {
            var field = UserSchema.tree[fieldName];

            if (field.default && !model[fieldName]) {
                model[fieldName] = __.result(field, 'default');
                changed = true;
            }
        });

        if (changed) {
            console.log('Auto migrated missing fields to defaults, User - ' + model.id);
            return model.save();
        }
    };

    if (isArray(models)) {
        models.forEach(function(model) {
            update(model);
        });
    } else {
        update(models);
    }
};

// Export
module.exports = mongoose.model('User', UserSchema);
