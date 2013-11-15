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

describe('User Management', function() {
    app.start(function() {
        it('should remove all users', function(done) {
            db.User.remove().exec(function(err) {
                assert.ok(!err);
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
    });
});