var async = require('async'),
    assert = require('assert'),
    common = require('../common'),
    app = require('../../'),
    db = app.db;

describe('Integration Test:', function() {
    before(function(done) {
        this.timeout(5000);
        console.log('\nIntegration testing');

        app.start(function() {
            async.parallel([
                db.User.remove().exec,
                db.Application.remove().exec,
                db.AuthorizationCode.remove().exec,
                db.AccessToken.remove().exec,
                db.RefreshToken.remove().exec
            ], done);
        });
    });

    after(function(done){
        app.stop(done);
    });

    var newUser = common.fixtures.newUser;
    it('should create new user', function(done) {
        db.User.create(newUser, function(err, user) {
            assert.ifError(err);
            assert.equal(user.name, newUser.name);
            assert.equal(user.username, newUser.username);
            assert.equal(user.email, newUser.email);
            done();
        });
    });

    require('./home.js');
    require('./session.js');
    require('./user.js');
});