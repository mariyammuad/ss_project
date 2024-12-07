import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Log from './models/Log.js';   // Assuming you log activities
import adminRoutes from './routes/adminRoutes.js';
import routes from './routes/index.js'; // Adjust path if needed
import Admin from './models/Admin.js';  // Corrected to include .js extension

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer setup for sending verification emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this if your React app is running on a different port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Add the admin routes middleware here
app.use('/api/admin', adminRoutes);
app.use('/api', routes);

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied, no token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// Middleware for Role-Based Authorization
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: "Access denied: Unauthorized" });
    }
  };
};

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const pepper = process.env.PEPPER;
  return bcrypt.hash(password + pepper, salt);
};

// Helper function to verify passwords
const verifyPassword = async (password, hashedPassword) => {
  const pepper = process.env.PEPPER;
  return bcrypt.compare(password + pepper, hashedPassword);
};

// Function to verify the reCAPTCHA token
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // reCAPTCHA secret key from environment variable
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error during reCAPTCHA verification:', error);
    return false;  // Return false in case of error
  }
}

// Utility function to verify admin credentials
const verifyAdmin = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return { isValid: false, message: 'Admin not found' };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return { isValid: false, message: 'Invalid password' };
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { isValid: true, token };
  } catch (error) {
    console.error('Error in verifyAdmin:', error);
    throw error;
  }
};


// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  const { email, password, recaptchaResponse } = req.body;

  if (!email || !password || !recaptchaResponse) {
    return res.status(400).json({ message: 'Email, password, and reCAPTCHA are required' });
  }

  try {
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: 'Invalid reCAPTCHA' });
    }

    const { isValid, token, message } = await verifyAdmin(email, password);
    if (!isValid) {
      return res.status(400).json({ message });
    }

    res.status(200).json({ message: 'Admin login successful', token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password, recaptchaResponse } = req.body;

  if (!username || !email || !password || !recaptchaResponse) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: 'Invalid reCAPTCHA' });
    }

    const userExists = await mongoose.connection.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
    };

    await mongoose.connection.collection('users').insertOne(newUser);

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.SERVER_URL}/api/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    });

    res.status(200).json({ message: 'Registration successful! Please verify your email.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Invalid or missing verification token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const result = await mongoose.connection.collection('users').updateOne(
      { email },
      { $set: { isEmailVerified: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).send('Email verification failed.');
    }

    res.status(200).send('Email verification successful! You can now log in.');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).send('Invalid or expired verification token');
  }
});

// Function to log user actions
const logUserAction = (userId, action) => {
  const log = new Log({
    userId: userId,
    action: action,
    timestamp: new Date(),
  });

  log.save()
    .then(() => console.log("Log saved"))
    .catch(err => console.error("Error saving log:", err));
};

// User login endpoint
app.post('/api/user/login', async (req, res) => {
  const { username, password, recaptchaResponse } = req.body;

  try {
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);
    if (!isRecaptchaValid) return res.status(400).json({ message: 'Invalid reCAPTCHA' });

    const user = await mongoose.connection.collection('users').findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Log the login action
    logUserAction(user._id, 'User logged in');  // Log the login action

    // Send response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch logs (only accessible for authenticated users)
app.get('/api/user/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });  // Fetch logs and sort by most recent
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs', error });
  }
});

// Start server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});