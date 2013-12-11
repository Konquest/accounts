var request = require('supertest'),
    assert = require('assert'),
    app = require('../../index'),
    config = app.config,
    db = app.db,
    common = require('../common'),
    __ = require('underscore');

var createUser = common.fixtures.createUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls,
    sessionRequest = request.agent(host);

describe('User Management', function() {
    it('should redirect to login while logged out', function(done) {
        this.timeout(4000);
        request(host)
            .get(urls.users)
            .expect('Location', urls.session)
            .expect(302, done);
    });

    it('should create a new user and redirect to login', function(done) {
        request(host)
            .post(urls.users)
            .send(createUser)
            .expect('Location', urls.session)
            .expect(302, done);
    });

    it('should log in', function(done) {
        var credentials = __.pick(createUser, 'username', 'password');

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile(createUser.username))
            .expect(302, done);
    });

    it('should list users', function(done) {
        this.timeout(4000);
        sessionRequest
            .get(urls.users)
            .expect(200, done);
    });

    it('should show user profile page', function(done) {
        sessionRequest
            .get(urls.profile(createUser.username))
            .expect(new RegExp(createUser.name))
            .expect(200, done);
    });

});