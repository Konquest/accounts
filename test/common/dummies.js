var faker = require('Faker');

var User = function() {
    return {
        username: faker.Internet.userName(),
        password: 'password',
        name: faker.Name.findName(),
        email: faker.Internet.email()
    };
};

module.exports = {
    newUser: new User(),
    createUser: new User(),
    createJsonUser: new User()
};