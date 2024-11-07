const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { client, connectToDatabase } = require('./db'); // Import MongoDB connection
const config = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas before handling requests
connectToDatabase().catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1); // Exit the application if the database connection fails
});

// Register route
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const db = client.db("secure_sys");

        // Check if username or email already exists
        const existingUser = await db.collection('users').findOne({ username });
        const existingEmail = await db.collection('users').findOne({ email });

        if (existingUser || existingEmail) {
            return res.status(400).json({ message: "User with this username or email already exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = { username, email, password: hashedPassword };
        await db.collection('users').insertOne(newUser);

        // Exclude the hashed password from the response
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({ message: 'Registration successful', user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const db = client.db("secure_sys");
        const user = await db.collection('users').findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create a token
        const token = jwt.sign({ userId: user._id, username: user.username, role }, config.jwtSecret, { expiresIn: '1h' });

        // Exclude the hashed password from the user object
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
