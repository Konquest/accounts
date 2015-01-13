var request = require('supertest'),
    server = require('../../server')(),
    common = require('../common'),
    fixtures = require('node-mongoose-fixtures'),
    lodash = require('lodash');

var urls = common.urls,
    sessionRequest = request.agent(server);

describe('Home Page', function() {

    beforeEach(function(done) {
        fixtures.reset(function() {
            fixtures('users', function() {
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
        var user = fixtures.get('users').Users[0];
        var credentials = lodash.pick(user, ['username', 'password']);

        sessionRequest
            .post(urls.session)
            .send(credentials)
            .expect('Location', urls.profile(user.username))
            .expect(302, done);
    });

    it('should show home page', function(done) {
        sessionRequest
            .get(urls.home)
            .expect(200, done);
    });

});
