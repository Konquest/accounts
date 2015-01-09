var faker = require('faker'),
    fixtures = require('node-mongoose-fixtures');

var user = function() {
    return {
        username: faker.Internet.userName(),
        password: 'password',
        name: faker.Name.findName(),
        email: faker.Internet.email()
    };
};

fixtures.save('users', {
    users: [
        user(),
        user()
    ]
});
