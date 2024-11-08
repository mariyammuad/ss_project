// config.js
require('dotenv').config();

const config = {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: {
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    cryptoSecret: process.env.CRYPTO_SECRET,
    emailVerificationExpireTime: parseInt(process.env.EMAIL_VERIFICATION_EXPIRE_TIME) || 3600, // Default 1 hour
};

module.exports = config;
