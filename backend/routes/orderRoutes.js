const express = require("express");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  getAnalytics,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Protected routes (any authenticated user)
router.post("/", protect, createOrder);
router.get("/user", protect, getUserOrders);

// Admin-only routes
router.get("/analytics", protect, admin, getAnalytics);
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
