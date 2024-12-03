// admin.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mariyammuad@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MLJWRyuOJiH8';

const verifyAdmin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ email: ADMIN_EMAIL, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { isValid: true, token };
    }
    return { isValid: false };
};

module.exports = verifyAdmin;