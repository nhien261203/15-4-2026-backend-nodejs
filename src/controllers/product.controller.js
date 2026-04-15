const Product = require("../models/product.model");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};