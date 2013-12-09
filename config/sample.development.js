module.exports = {
    port: process.env.PORT || 8080,
    logger: process.env.LOGGER || 'default',
    db: process.env.MONGO_URL || 'mongodb://localhost/accounts',
    session: {
        age: process.env.SESSION_AGE || 7200000,
        key: process.env.SESSION_KEY || 'SID',
        secret: process.env.SESSION_SECRET || '2613' // chosen by four fair dice rolls; guarenteed to be random
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
        name: process.env.SITE_NAME || 'User Valet'
    }
};
