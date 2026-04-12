const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// ----- CREATE ORDER -----
// POST /api/orders (protected)
const createOrder = asyncHandler(async (req, res) => {
  const { products, totalAmount, deliveryAddress, paymentStatus } = req.body;

  if (!products || products.length === 0) {
    res.status(400);
    throw new Error("No products in order");
  }

  // Reduce stock for each ordered product
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
    }
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    userId: req.user._id,
    products,
    totalAmount,
    deliveryAddress,
    paymentStatus: paymentStatus || "paid",
    orderStatus: "placed",
  });

  // Emit event via Socket.io to alert Admins
  if (req.io) {
    req.io.emit("newOrderPlaced", order);
  }

  res.status(201).json(order);
});

// ----- GET ALL ORDERS (Admin) -----
// GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// ----- GET CURRENT USER'S ORDERS -----
// GET /api/orders/user (protected)
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// ----- UPDATE ORDER STATUS (Admin) -----
// PUT /api/orders/:id
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

  const updated = await order.save();

  // Emit event via Socket.io to alert Users
  if (req.io) {
    req.io.emit("orderStatusUpdated", updated);
  }

  res.json(updated);
});

// ----- GET ANALYTICS (Admin) -----
// GET /api/orders/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  // Get date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        paymentStatus: "paid"
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // Sort by date ascending
  ]);

  // Format for Recharts: [{ date: '2023-10-01', revenue: 500 }, ...]
  const formattedData = salesData.map(item => ({
    date: item._id,
    revenue: item.totalRevenue,
    orders: item.orderCount
  }));

  res.json(formattedData);
});

module.exports = { createOrder, getAllOrders, getUserOrders, updateOrderStatus, getAnalytics };
