import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
      pidx: { type: String, required: true, unique: true }, // Payment identifier
      status: { type: String, required: true, enum: ["Completed", "Pending", "User canceled"] },
      transaction_id: { type: String, required: false },
      tidx: { type: String, required: false }, // Same as transaction_id
      amount: { type: Number, required: true }, // Amount in paisa
      mobile: { type: String, required: false }, // Payer KHALTI ID
      purchase_order_id: { type: String, required: true }, // Initial order ID
      purchase_order_name: { type: String, required: true }, // Initial order name
      total_amount: { type: Number, required: false }, // Same as amount
    },
    { timestamps: true }
  );

export default mongoose.model('Transaction', transactionSchema);