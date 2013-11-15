module.exports = {
    port: 8080,
    db: 'mongodb://test:test@ds035348.mongolab.com:35348/unit-test',
    logger: false,
    session: {
        age: 7200000,
        key: 'SID',
        secret: '2613' // chosen by four fair dice rolls; guarenteed to be random
    },
    oauth2: {
        features: {
            client: true,
            code: true,
            implicit: true,
            password: true
        },
        authorizationCode: { expires: 600 },    // 10 minutes
        accessToken: { length: 256, expires: 3600 },     // 1 hour
        refreshToken: { length: 256, expires: 86400 * 365 }    // 1 year = 1 day * 365
    }
};