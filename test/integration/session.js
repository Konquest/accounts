var request = require('supertest'),
    assert = require('assert'),
    async = require('async'),
    app = require('../../'),
    config = app.config,
    db = app.db,
    common = require('../common'),
    __ = require('underscore');


var fakeUser = common.fixtures.newUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls,
    sessionRequest = request.agent(host);

describe('Session Management', function() {
    it('should remove all users', function(done) {
        db.User.remove().exec(function(err) {
            assert.ifError(err);
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
        request(host)
            .get(urls.users)
            .expect('Location', urls.session)
            .expect(302, done);
    });

    it('should show login with error when failing to login', function(done) {
        var credentials = __.pick(fakeUser, 'username');

        request(host)
            .post(urls.session)
            .send(credentials)
            .expect(200)
            .expect(/Incorrect Username\/Password/, done);
    });

    it('should redirect to user profile when logging in', function(done) {
        var credentials = __.pick(fakeUser, 'username', 'password');

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile)
            .expect(302, done);
    });


    it('should not redirect when accessing protected page while logged in', function(done) {
        sessionRequest
            .get(urls.users)
            .expect(200, done);
    });

    it('should redirect to home when logging out', function(done) {
        sessionRequest
            .get(urls.logout)
            .expect('Location', urls.home)
            .expect(302, done);
    });

});
