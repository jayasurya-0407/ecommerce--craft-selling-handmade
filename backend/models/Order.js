const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  orderType: { type: String, required: true, enum: ['cart_checkout', 'custom_request'] },
  
  // For Custom Orders
  interestedIn: { type: String },
  designDetails: { type: String },
  
  // For Cart Checkouts
  items: [
    {
      productId: Number,
      title: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: { type: Number },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
