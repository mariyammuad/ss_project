require('dotenv').config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("Admin email or password is not defined in the environment variables.");
}
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error("Email user or password is not defined in the environment variables.");
}

// Export configuration
const config = {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail', // Default to Gmail if not provided
        user: process.env.MAIL_USER, // Align with .env
        pass: process.env.MAIL_PASS, // Align with .env
    },
    cryptoSecret: process.env.CRYPTO_SECRET || 'defaultCryptoSecret', // Fallback for development
    emailVerificationExpireTime: parseInt(process.env.EMAIL_VERIFICATION_EXPIRE_TIME, 10) || 3600, // Default 1 hour
    pepper: process.env.PEPPER || 'defaultPepper', // Fallback for development
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || '',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000', // Default client URL
};

module.exports = config;
