var request = require('request'),
    assert = require('assert'),
    should = require('should'),
    config = require('../../config'),
    common = require('../common'),
    app = require('../../index'),
    db = require('../../db'),
    __ = require('underscore');

var request = request.defaults({jar: true}),
    fakeUser = common.fixtures.newUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls;

describe('User Management', function() {
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