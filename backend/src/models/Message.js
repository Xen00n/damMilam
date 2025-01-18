import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: false }, // For normal messages
  priceOffer: { type: Number, required: false }, // For price-related messages
  negotiationStatus: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'countered', null], 
    default: null, 
  }, // Optional for price negotiation
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
