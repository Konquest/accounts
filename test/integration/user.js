var request = require('supertest'),
    assert = require('assert'),
    config = require('../../config'),
    common = require('../common'),
    app = require('../../index'),
    db = require('../../db'),
    __ = require('underscore');

var fakeUser = common.fixtures.newUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls,
    sessionRequest = request.agent(host);

describe('User Management', function() {
    it('should remove all users', function(done) {
        db.User.remove().exec(function(err) {
            assert.ifError(err);
            done();
        });
    });

    it('should create a new user and redirect to login', function(done) {
        request(host)
            .post(urls.users)
            .send(fakeUser)
            .expect('Location', urls.session)
            .expect(302, done);
    });

    it('should log in', function(done) {
        var credentials = __.pick(fakeUser, 'username', 'password');

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile)
            .expect(302, done);
    });

/*
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
*/
});