var async = require('async'),
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

    require('./session.js');
    require('./user.js');
});