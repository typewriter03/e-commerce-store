const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const app = express();
const PORT = process.env.PORT || 5001;
const axios = require('axios');

let productsCache = [];

const fetchProducts = async () => {
  try {
    const { data } = await axios.get('https://fakestoreapi.com/products');
    productsCache = data.map(product => ({
      id: String(product.id),
      name: product.title,
      price: product.price,
      image: product.image,
      description: product.description
    }));
    console.log(`Fetched and cached ${productsCache.length} products.`);
  } catch (error) {
    console.error('Error fetching products from Fake Store API:', error.message);
  }
};

connectDB();

app.use(cors());
app.use(express.json());
const hydrateCart = (cartItemsFromDB) => {
  const hydratedCart = cartItemsFromDB.map(item => {
    
    const product = productsCache.find(p => p.id === item.productId);

    
    if (!product) {
      console.warn(`Product with ID ${item.productId} not found in cache.`);
      return null;
    }

    return {
      _id: item._id,
      id: item.productId,
      name: product.name,
      price: product.price,
      qty: item.qty,
      image: product.image // Pass image to frontend
    };
  }).filter(item => item !== null);

  const total = hydratedCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  return { hydratedCart, total: total.toFixed(2) };
};
// --- API Routes ---

/**
 * @route   GET /
 * @desc    Welcome message for the API root
 */
app.get('/', (req, res) => {
  res.send('Vibe Commerce API is running...');
});

/**
 * @route   GET /api/products
 * @desc    Get all available products (from data.js for now)
 */
app.get('/api/products', (req, res) => {
  res.json(productsCache);
});

/**
 * @route   GET /api/cart
 * @desc    Get all items in the cart (from DB)
 */
app.get('/api/cart', async (req, res) => {
  try {
    const cartItemsFromDB = await CartItem.find();
    const { hydratedCart, total } = hydrateCart(cartItemsFromDB);
    res.json({ cartItems: hydratedCart, total: total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add/update item in cart (in DB)
 */
app.post('/api/cart', async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty || qty < 1) {
    return res.status(400).json({ message: 'Invalid product data' });
  }

  try {
    let existingItem = await CartItem.findOne({ productId: productId });

    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
    } else {
        const productExists = productsCache.find(p => p.id === productId);  
      if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const newItem = new CartItem({
        productId: productId,
        qty: qty,
      });
      await newItem.save();
    }

    const cartItemsFromDB = await CartItem.find();
    const { hydratedCart, total } = hydrateCart(cartItemsFromDB);
    res.json({ cartItems: hydratedCart, total: total });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove an item from the cart (from DB)
 * @note    
 */
app.delete('/api/cart/:id', async (req, res) => {
  const productId = req.params.id;
  
  try {
    const deletedItem = await CartItem.findOneAndDelete({ productId: productId });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const cartItemsFromDB = await CartItem.find();
    const { hydratedCart, total } = hydrateCart(cartItemsFromDB);
    res.json({ cartItems: hydratedCart, total: total });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route   POST /api/checkout
 * @desc    Create a new order, save it to DB, and clear the cart
 */
app.post('/api/checkout', async (req, res) => {
  const { user } = req.body; 
  if (!user || !user.name || !user.email) {
    return res.status(400).json({ message: 'User name and email are required' });
  }

  try {
    const cartItemsFromDB = await CartItem.find();
    if (cartItemsFromDB.length === 0) {
      return res.status(400).json({ message: 'Cannot checkout with an empty cart' });
    }
    
    const { hydratedCart, total } = hydrateCart(cartItemsFromDB);

    const newOrder = new Order({
      user: {
        name: user.name,
        email: user.email,
      },
      items: hydratedCart.map(item => ({ 
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      total: parseFloat(total),
      receiptId: `VIBE-ORD-${Date.now()}`,
    });

    const savedOrder = await newOrder.save();

    // Clear the cart collection *only after* the order is successfully saved
    await CartItem.deleteMany({});

    
    res.json(savedOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('(Make sure your MongoDB is connected if you see errors)');
  fetchProducts();
});