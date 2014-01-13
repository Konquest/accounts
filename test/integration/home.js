var request = require('supertest'),
    app = require('../../'),
    config = app.config,
    common = require('../common'),
    __ = require('underscore');


var fakeUser = common.dummies.newUser,
    host = 'http://localhost:' + config.port,
    urls = common.urls,
    sessionRequest = request.agent(host);

describe('Home Page', function() {

    it('should redirect to login while logged out', function(done) {
        request(host)
            .get(urls.home)
            .expect('Location', urls.session)
            .expect(302, done);
    });

    it('should log in', function(done) {
        var credentials = __.pick(fakeUser, 'username', 'password');

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile(fakeUser.username))
            .expect(302, done);
    });

    it('should show home page', function(done) {
        sessionRequest
            .get(urls.home)
            .expect(200, done);
    });

});
