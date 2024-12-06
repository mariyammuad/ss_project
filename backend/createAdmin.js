import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js'; // Include .js extension

// Load environment variables from .env file
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to your MongoDB database using the URI from the environment variable
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected successfully');

    // Create the admin
    const newAdmin = new Admin({
      email: 'mariyammuad@gmail.com',
      password: 'MLJWRyuOJiH8',
    });

    await newAdmin.save();
    console.log('Admin created successfully:', newAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    // Disconnect the database
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

createAdmin();
