const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// ----- GET ALL PRODUCTS -----
// GET /api/products?category=&search=&page=&limit=
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 8 } = req.query;
  const filter = {};

  // Optional category filter
  if (category) {
    filter.category = category;
  }

  // Optional search by name (case-insensitive)
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const pageNum = Number(page) || 1;
  const pageSize = Number(limit) || 8;
  const skip = (pageNum - 1) * pageSize;

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// ----- GET SINGLE PRODUCT -----
// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ----- CREATE PRODUCT (Admin) -----
// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    image,
  });

  res.status(201).json(product);
});

// ----- UPDATE PRODUCT (Admin) -----
// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Update only the fields that are provided
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedProduct);
});

// ----- DELETE PRODUCT (Admin) -----
// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product removed" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
