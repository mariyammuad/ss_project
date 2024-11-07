// config.js
require('dotenv').config();

const config = {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
};

module.exports = config;
