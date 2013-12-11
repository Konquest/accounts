module.exports = {
    port: 8080,
    db: process.env.MONGO_URL || 'mongodb://localhost/accounts-test',
    //logger: process.env.LOGGER || 'default',
    logger: process.env.LOGGER || ('default' && process.env.NODE_ENV !== 'testing'),
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
    },
    site: {
        name: process.env.SITE_NAME || 'Konquest'
    }
};