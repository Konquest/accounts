var common = require('../common');

describe('Unit:', function() {
    before(function(done) {
        console.log('\nUnit testing');

        common.clearData(done);
    });

    require('./user');
});