// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const connectDB = require('./db');
// require('dotenv').config();

// const createAdmin = async () => {
//   const saltRounds = 10;
//   const plaintextPassword = "Mariyam#2002"; // Change this
//   const username = "mariyam"; // Change this

//   try {
//     await connectDB();
//     const hash = await bcrypt.hash(plaintextPassword, saltRounds);

//     const admin = {
//       username,
//       password: hash,
//       role: "admin",
//     };

//     const result = await mongoose.connection.collection('users').insertOne(admin);
//     console.log('Admin created:', result);
//   } catch (error) {
//     console.error('Error creating admin:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// createAdmin();
