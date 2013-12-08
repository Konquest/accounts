var app = require('../../');

describe('Integration Test:', function() {
    before(function(done) {
        this.timeout(5000);
        console.log('\nIntegration testing');

        //TODO delete all data
        app.start(done);
    });

    after(function(done){
        app.stop(done);
    });

    require('./session.js');
    require('./user.js');
});