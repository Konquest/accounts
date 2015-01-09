var request = require('supertest'),
    server = require('../../server')(),
    common = require('../common'),
    __ = require('underscore');


var fakeUser = common.dummies.newUser,
    urls = common.urls,
    sessionRequest = request.agent(server);

describe('Home Page', function() {

    it('should redirect to login while logged out', function(done) {
        request(server)
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
