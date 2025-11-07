const mongoose = require('mongoose');


const CartItemSchema = new mongoose.Schema({
  productId: {
    type: String, 
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  
});

module.exports = mongoose.model('CartItem', CartItemSchema);