var assert = require('assert'),
    db = require('../../app/db');

var fakeUser = require('../common').dummies.newUser;

describe('User Model', function() {
    it('should fail when validating an blank user', function(done) {
        var expectedErrors = {
                name: 'required',
                roles: 'must have at least one role',
                email: 'must be an email address',
                password: 'must be 4 characters or more',
                username: 'must be 3 characters or more'
            },
            user = new db.User({
                username: 'u', // short
                password: 'p', // short
                email: 'not email', // invalid email
                roles: [] // blank roles
            });
        user.validate(function(err) {
            assert.ok(err);    // Should be an error
            Object.keys(err.errors).forEach(function(fieldName) {
                assert.equal(err.errors[fieldName].type, expectedErrors[fieldName], fieldName + ' must have correct error message');
            });
            done();
        });
    });


    it('should fail when validating an invalid user', function(done) {
        var expectedErrors = {
                roles: 'must be valid roles - user, admin'
            },
            user = new db.User({
                username: 'username',
                password: 'password',
                name: 'some name',
                email: 'valid@test.test',
                roles: ['non existant']
            });
        user.validate(function(err) {
            assert.ok(err);    // Should be an error
            Object.keys(err.errors).forEach(function(fieldName) {
                assert.equal(err.errors[fieldName].type, expectedErrors[fieldName], fieldName + ' must have correct error message');
            });
            done();
        });
    });

    it('should create a new user', function(done) {
        var user = new db.User(fakeUser);

        user.save(function(err) {
            assert.ifError(err);
            assert.equal(user.username, fakeUser.username);
            assert.equal(user.name, fakeUser.name);
            assert.notEqual(user.password, fakeUser.password, 'actual password should be encrypted');
            assert.equal(user.email, fakeUser.email);

            done();
        });

    });

    it('should default new user to role `user`', function(done) {
        db.User
            .findOne({active: true, username: fakeUser.username})
            .exec(function(err, user) {
                assert.ifError(err);
                assert.ok(user.isA('user'), 'should be `user`');

                done();
            });
    });

});