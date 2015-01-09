var request = require('supertest'),
    server = require('../../server')(),
    common = require('../common'),
    users = require('../fixtures/users'),
    __ = require('underscore');


var fixtureUser = users.create(),
    urls = common.urls,
    sessionRequest = request.agent(server);

describe('Session Management', function() {

    it('should show login page', function(done) {
        request(server)
            .get(urls.session)
            .expect(200, done);
    });

    it('should show login with error when failing to login', function(done) {
        var credentials = __.pick(fixtureUser, 'username');

        request(server)
            .post(urls.session)
            .send(credentials)
            .expect(200)
            .expect(/Incorrect Username\/Password/, done);
    });

    it('should redirect to user profile when logging in', function(done) {
        var credentials = __.pick(fixtureUser, 'username', 'password');

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile(fixtureUser.username))
            .expect(302, done);
    });


    it('should not redirect when accessing protected page while logged in', function(done) {
        this.timeout(4000);
        sessionRequest
            .get(urls.users)
            .expect(200, done);
    });

    it('should redirect to user profile when already logged in', function(done) {
        sessionRequest
            .get(urls.session)
            .expect('Location', urls.profile(fixtureUser.username))
            .expect(302, done);
    });

    it('should redirect to home when logging out', function(done) {
        sessionRequest
            .get(urls.logout)
            .expect('Location', urls.home)
            .expect(302, done);
    });

    it('should redirect to session when logging out', function(done) {
        sessionRequest
            .get(urls.home)
            .expect('Location', urls.session)
            .expect(302, done);
    });

});
