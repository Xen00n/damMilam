// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: true, 
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'] // Ensures exactly 10 digits
  },
  memberSince: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model('User', userSchema);
