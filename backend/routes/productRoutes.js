const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Create a product
router.post('/', protect, async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, price, img, category } = req.body;
    const product = new Product({
      id: Date.now(), // Generate a simple ID
      title, shortDesc, fullDesc, price, img, category
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Update a product
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.title = req.body.title || product.title;
      product.shortDesc = req.body.shortDesc || product.shortDesc;
      product.fullDesc = req.body.fullDesc || product.fullDesc;
      product.price = req.body.price || product.price;
      product.img = req.body.img || product.img;
      product.category = req.body.category || product.category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
