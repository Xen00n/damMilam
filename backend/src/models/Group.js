import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  access: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['buyer', 'seller'], required: true }, // Role added to access
  }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Store the userId to reference the user
    username: { type: String }, // Store the username in the request
    name: { type: String }, // Store the user's name
    role: { type: String, enum: ['buyer', 'seller'], required: true }, // Store the user's role
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  }],
  price: { type: Number, required: true },  // Price is required
  groupName: { type: String, required: true },  // groupName is required
  name: { type: String, required: true },  // Product name
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
