var faker = require('Faker');

module.exports = {
    newUser: {
        username: faker.Internet.userName(),
        password: 'password',
        name: faker.Name.findName(),
        email: faker.Internet.email()
    },
    createUser: {
        username: faker.Internet.userName(),
        password: 'password',
        name: faker.Name.findName(),
        email: faker.Internet.email()
    },
    createJsonUser: {
        username: faker.Internet.userName(),
        password: 'password',
        name: faker.Name.findName(),
        email: faker.Internet.email()
    }
};