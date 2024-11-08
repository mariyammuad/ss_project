const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json()); // To parse JSON data

// MongoDB URI
const uri = "mongodb+srv://mariyam_muad:H8Qm6wueveWOb08R@cluster0.wg6di.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Set up email transporter using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Helper function to send email verification link
const sendVerificationEmail = (email, token) => {
  const verificationUrl = `http://localhost:5000/api/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Verification email sent: ' + info.response);
    }
  });
};

// User registration endpoint (with email verification)
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Generate a JWT token for email verification
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Check if the user already exists in the MongoDB collection
    await client.connect();
    const database = client.db('secure_sys');
    const usersCollection = database.collection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Temporarily store user data in memory until email verification is complete
    const userData = { username, email, password: hashedPassword, isEmailVerified: false, verificationToken: token };

    // Send email verification
    sendVerificationEmail(email, token);

    // Store user data temporarily in the database with email unverified status
    await usersCollection.insertOne(userData);

    res.status(200).json({ message: 'Registration successful! Please check your email for the verification link.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Check if the email exists in the users collection
    await client.connect();
    const database = client.db('secure_sys');
    const usersCollection = database.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's email verification status
    await usersCollection.updateOne(
      { email },
      { $set: { isEmailVerified: true } }
    );

    res.status(200).json({ message: 'Email successfully verified' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// User login endpoint (No email verification needed, just username and password)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const database = client.db('secure_sys');
    const usersCollection = database.collection('users');
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Validate password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If password is correct, generate a JWT token for the session
    const userToken = jwt.sign({ email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.status(200).json({ message: 'Login successful', token: userToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server and connect to MongoDB
async function connectToDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB!");
    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the function to initialize the server
connectToDatabase().catch(console.dir);
