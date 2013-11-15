var request = require('request'),
    assert = require('assert'),
    faker = require('Faker'),
    config = require('../config'),
    app = require('../index'),
    db = require('../db'),
    __ = require('underscore');

var request = request.defaults({jar: true});

var urls = {
    logout: 'http://localhost:' + config.port + '/session/logout',
    users: 'http://localhost:' + config.port + '/users',
    session: 'http://localhost:' + config.port + '/session'
};

describe('Session Management', function() {
    app.start(function() {
        it('should remove all users', function(done) {
            db.User.remove().exec(function(err) {
                assert.ok(!err);
                done();
            });
        });
        
        var fakeUser = {
            username: faker.Internet.userName(),
            password: 'password',
            name: faker.Name.findName(),
            email: faker.Internet.email()
        };
        
        it('should create new user', function(done) {
            db.User.create(fakeUser, function(err, user) {
                assert.ifError(err);
                assert.equal(user.name, fakeUser.name);
                assert.equal(user.username, fakeUser.username);
                assert.equal(user.email, fakeUser.email);
                done();
            });
        });

        it('should redirect to login when logged out', function(done) {
            request.get(urls.logout);
            request.get(urls.users, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.req.path, '/session');
                done();
            });
        });
        
        it('should redirect to login when failing to login', function(done) {
            var credentials = __.pick(fakeUser, 'username');
            request.get(urls.session, {form: credentials}, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.req.path, '/session');
                done();
            });
        });
        
        it('should redirect to user profile when logging in', function(done) {
            var credentials = __.pick(fakeUser, 'username', 'password');
            request.post(urls.session, {form: credentials}, function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.headers.location, '/users/' + fakeUser.username);
                done();
            });
        });
    });
});