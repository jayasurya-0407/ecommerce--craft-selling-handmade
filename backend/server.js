require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10
})
  .then(() => {
  console.log('Connected to MongoDB successfully!');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Have you replaced <db_password> in backend/.env with your actual password?');
});

// Routes

// Make uploads folder static
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Public Product Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/products', productRoutes);

// User Auth Routes
const { router: authRoutes } = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Public Order Routes
app.post('/api/orders/custom', async (req, res) => {
  try {
    const { userId, name, email, productType, details } = req.body;
    
    const newOrder = new Order({
      userId: userId || null,
      customerName: name,
      customerEmail: email,
      orderType: 'custom_request',
      interestedIn: productType,
      designDetails: details
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/orders/checkout', async (req, res) => {
  try {
    const { userId, name, email, items, totalAmount } = req.body;
    
    const newOrder = new Order({
      userId: userId || null,
      customerName: name || 'Guest',
      customerEmail: email || 'No email provided',
      orderType: 'cart_checkout',
      items: items,
      totalAmount: totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
