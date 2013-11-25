var request = require('request'),
    assert = require('assert'),
    should = require('should'),
    config = require('../config'),
    common = require('./common'),
    app = require('../index'),
    db = require('../db'),
    __ = require('underscore');

var request = request.defaults({jar: true}),
    fakeUser = common.fixtures.newUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls;

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

describe('User Management', function() {
    app.start(function() {
        it('should remove all users', function(done) {
            db.User.remove().exec(function(err) {
                assert.ifError(err);
                done();
            });
        });
        
        it('should create a new user and redirect to login', function(done) {
            request.get(host + urls.logout);
            request.post(host + urls.users, {form: fakeUser}, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.headers.location, urls.session);
                done();
            });
        });
        
        it('should redirect to user profile when logging in', function(done) {
            var credentials = __.pick(fakeUser, 'username', 'password');
            request.post(host + urls.session, {form: credentials}, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.headers.location, urls.profile);
                done();
            });
        });
        
        it('should show user profile page', function(done) {
            request.get(host + urls.profile, function(err, res, body) {
                assert.ifError(err);
                res.body.should.contain(fakeUser.name);
                done();
            });
        });
        
        it('should list users', function(done) {
            request.get(host + urls.users, function(err, res, body) {
                assert.ifError(err);
                res.body.should.contain(fakeUser.username);
                done();
            });
        });
    });
});