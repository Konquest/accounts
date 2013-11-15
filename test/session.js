var request = require('request'),
    assert = require('assert'),
    config = require('../config'),
    common = require('./common'),
    app = require('../index'),
    db = require('../db'),
    __ = require('underscore');

var request = request.defaults({jar: true}),
    fakeUser = common.fixtures.newUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls;

describe('Session Management', function() {
    app.start(function() {
        it('should remove all users', function(done) {
            db.User.remove().exec(function(err) {
                assert.ok(!err);
                done();
            });
        });
        
        it('should create new user', function(done) {
            db.User.create(fakeUser, function(err, user) {
                assert.ifError(err);
                assert.equal(user.name, fakeUser.name);
                assert.equal(user.username, fakeUser.username);
                assert.equal(user.email, fakeUser.email);
                done();
            });
        });

        it('should redirect to login when accessing protected page while logged out', function(done) {
            request.get(host + urls.logout);
            request.get(host + urls.users, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.req.path, urls.session);
                done();
            });
        });
        
        it('should redirect to login when failing to login', function(done) {
            var credentials = __.pick(fakeUser, 'username');
            request.post(host + urls.session, {form: credentials}, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.req.path, urls.session);
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
        
        it('should not redirect when accessing protected page while logged in', function(done) {
            request.get(host + urls.users, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.req.path, urls.users);
                done();
            });
        });
        
        it('should redirect to home when logging out', function(done) {
            request.get(host + urls.logout, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.req.path, urls.home);
                done();
            });
        });
    });
});