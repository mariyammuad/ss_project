// models/Admin.js
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware to hash the password before saving
AdminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default model('Admin', AdminSchema); // Default export
