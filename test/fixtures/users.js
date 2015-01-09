var faker = require('faker'),
    fixtures = require('node-mongoose-fixtures');

var user = exports.create = function() {
    return {
        username: faker.internet.userName(),
        password: 'password',
        name: faker.name.findName(),
        email: faker.internet.email()
    };
};

fixtures.save('users', {
    users: [
        user(),
        user()
    ]
});
