var assert = require('assert'),
    fixtures = require('node-mongoose-fixtures'),
    users = require('../fixtures/users'),
    db = require('../../server/models');

describe('User Model', function() {
    beforeEach(function(next) {
        fixtures('Users', function() {
            next();
        });
    });

    afterEach(function(next) {
        fixtures.reset(function() {
            next();
        });
    });

    it.skip('should fail when validating an blank user', function(done) {
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

    it.skip('should fail when validating an invalid user', function(done) {
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
        var userFixture = users.create();
        var user = new db.User(userFixture);

        user.save(function(err) {
            assert.ifError(err);
            assert.equal(user.username, userFixture.username);
            assert.notEqual(user.password, userFixture.password, 'actual password should be encrypted');
            assert.equal(user.email, userFixture.email);

            done();
        });

    });

    it.skip('should default new user to role `user`', function(done) {
        db.User
            .findOne({active: true, username: userFixture.username})
            .exec(function(err, user) {
                assert.ifError(err);
                assert.ok(user.isA('user'), 'should be `user`');

                done();
            });
    });

});
