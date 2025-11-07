const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
    }
  ],

  // Order summary
  total: {
    type: Number,
    required: true,
  },

  receiptId: {
    type: String,
    required: true,
    unique: true,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);