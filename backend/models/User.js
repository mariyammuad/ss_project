import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
});

export default model('User', UserSchema);
