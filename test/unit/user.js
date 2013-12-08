var assert = require('assert'),
    db = require('../../db');

describe('User Schema', function() {
    it('should fail when validating an invalid user', function(done) {
        var expectedErrors = {
            name: 'required',
            roles: 'must have at least one role',
            email: 'must be an email address',
            password: 'must be 4 characters or more',
            username: 'must be 3 characters or more'
        };

        var user = new db.User({
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
});