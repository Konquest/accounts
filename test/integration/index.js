var assert = require('assert'),
    common = require('../common'),
    app = require('../../'),
    db = app.db;

describe('Integration Test:', function() {
    before(function(done) {
        this.timeout(5000);
        console.log('\nIntegration testing'.underline);

        app.start(function() {
            common.clearData(done);
        });
    });

    it('should create new user', function(done) {
        var newUser = common.dummies.newUser;
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
