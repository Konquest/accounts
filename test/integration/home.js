var request = require('supertest'),
    server = require('../../server')(),
    common = require('../common'),
    users = require('../fixtures/users'),
    fixtures = require('node-mongoose-fixtures'),
    __ = require('underscore');


var fixtureUser = users.create(),
    urls = common.urls,
    sessionRequest = request.agent(server);

describe('Home Page', function() {

    beforeEach(function(done) {
        fixtures.reset(function() {
            // console.log(arguments);

            fixtures('users', function() {
                // console.log(arguments);
                done();
            });
        });
    });

    it('should redirect to login while logged out', function(done) {
        request(server)
            .get(urls.home)
            .expect('Location', urls.session)
            .expect(302, done);
    });

    it('should log in', function(done) {
        var credentials = __.pick(fixtureUser, 'username', 'password');

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile(fixtureUser.username))
            .expect(302, done);
    });

    it('should show home page', function(done) {
        sessionRequest
            .get(urls.home)
            .expect(200, done);
    });

});
