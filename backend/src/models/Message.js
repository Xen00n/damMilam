import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  senderName: { type: String, required: true }, // Adjust based on user data
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
