// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { client } = require('./db');
// const config = require('./config');
// const validator = require('validator'); // For input sanitization and validation
// const winston = require('winston'); // For logging

// // Setup logger
// const logger = winston.createLogger({
//     level: 'info',
//     transports: [
//         new winston.transports.Console({ format: winston.format.simple() }),
//         new winston.transports.File({ filename: 'app.log' })
//     ],
// });

// // Function to validate user input
// const validateUserInput = (username, email, password) => {
//     if (!validator.isAlphanumeric(username)) {
//         throw new Error('Username must be alphanumeric.');
//     }

//     if (!validator.isEmail(email)) {
//         throw new Error('Invalid email format.');
//     }

//     if (password.length < 8) {
//         throw new Error('Password must be at least 8 characters long.');
//     }

//     if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
//         throw new Error('Password must contain at least one uppercase letter and one number.');
//     }
// };

// // Function to sanitize user input
// const sanitizeUserInput = (username, email) => {
//     const sanitizedUsername = validator.escape(username);  // Escapes any special characters in username
//     const sanitizedEmail = validator.normalizeEmail(email);  // Normalizes email for consistency
//     return { sanitizedUsername, sanitizedEmail };
// };

// // Register User
// const registerUser = async (username, email, password) => {
//     const db = client.db();

//     // Input validation and sanitization
//     validateUserInput(username, email, password);
//     const { sanitizedUsername, sanitizedEmail } = sanitizeUserInput(username, email);

//     // Check if username or email already exists
//     const existingUser = await db.collection('users').findOne({ username: sanitizedUsername });
//     const existingEmail = await db.collection('users').findOne({ email: sanitizedEmail });

//     if (existingUser || existingEmail) {
//         logger.warn(`Failed registration attempt: User with username ${sanitizedUsername} or email ${sanitizedEmail} already exists.`);
//         throw new Error("User with this username or email already exists!");
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = { username: sanitizedUsername, email: sanitizedEmail, password: hashedPassword };
//     await db.collection('users').insertOne(newUser);

//     // Exclude the hashed password from the response
//     const { password: _, ...userWithoutPassword } = newUser;

//     // Log the registration
//     logger.info(`User ${sanitizedUsername} registered successfully.`);

//     return userWithoutPassword;
// };

// // Login User
// const loginUser = async (username, password) => {
//     const db = client.db();
//     const sanitizedUsername = validator.escape(username); // Sanitize username input

//     // Find the user by username
//     const user = await db.collection('users').findOne({ username: sanitizedUsername });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//         logger.warn(`Failed login attempt: Invalid username or password for ${sanitizedUsername}.`);
//         throw new Error("Invalid username or password");
//     }

//     // Create a token
//     const token = jwt.sign({ userId: user._id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

//     // Exclude the hashed password from the user object
//     const { password: _, ...userWithoutPassword } = user;

//     // Log the successful login
//     logger.info(`User ${sanitizedUsername} logged in successfully.`);

//     return { token, user: userWithoutPassword };
// };

// module.exports = { registerUser, loginUser };
