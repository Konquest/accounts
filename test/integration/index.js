var app = require('../../index');

describe('Integration Test:', function() {
    before(function(done) {
        app.start(done);
    });

    after(function(done){
        app.stop(done);
    });

    require('./session.js');
    //require('./user.js');
});