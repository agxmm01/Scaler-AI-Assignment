const express = require("express");
const router = express.Router();
const db = require("../db/conn.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware: Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

// ==================== CREATE ORDER ====================
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      subtotal,
      tax = 0,
      shipping_charge = 0,
      shipping_address,
      payment_method = "cod",
      coupon_code = null
    } = req.body;

    // Validate address
    if (!shipping_address || !shipping_address.name || !shipping_address.phone || 
        !shipping_address.email || !shipping_address.street || !shipping_address.city || 
        !shipping_address.state || !shipping_address.pincode) {
      return res.status(400).json({ success: false, message: "Invalid shipping address" });
    }

    // Get cart items
    const [cartItems] = await db.execute(
      `SELECT c.*, p.price, p.mrp, p.discount, p.stock, p.name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Check stock availability
    for (let item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.name}` 
        });
      }
    }

    // Calculate total
    const total_amount = parseFloat(subtotal) + parseFloat(tax) + parseFloat(shipping_charge);
    const order_number = generateOrderNumber();

    // Create order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (
        user_id, order_number, subtotal, tax, shipping_charge, total_amount,
        payment_method, payment_status,
        shipping_address_name, shipping_address_phone, shipping_address_email,
        shipping_address_street, shipping_address_city, shipping_address_state,
        shipping_address_pincode, shipping_address_country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, order_number, subtotal, tax, shipping_charge, total_amount,
        payment_method, 'completed',
        shipping_address.name, shipping_address.phone, shipping_address.email,
        shipping_address.street, shipping_address.city, shipping_address.state,
        shipping_address.pincode, shipping_address.country || 'India'
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (let item of cartItems) {
      await db.execute(
        `INSERT INTO order_items (
          order_id, product_id, product_name, quantity, price, mrp, 
          discount_percent, line_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, item.product_id, item.name, item.quantity,
          item.price, item.mrp, item.discount,
          (item.price * item.quantity)
        ]
      );

      // Update product stock
      await db.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await db.execute(
      "DELETE FROM cart WHERE user_id = ?",
      [userId]
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: orderId,
      orderNumber: order_number,
      totalAmount: total_amount
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== GET USER ORDERS ====================
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [orders] = await db.execute(
      `SELECT id, order_number, total_amount, status, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    const [totalCount] = await db.execute(
      "SELECT COUNT(*) as count FROM orders WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({
      success: true,
      orders: orders,
      pagination: {
        total: totalCount[0].count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });

  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== GET ORDER DETAILS ====================
router.get("/:orderId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    // Get order header
    const [orders] = await db.execute(
      `SELECT * FROM orders 
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    // Get order items
    const [orderItems] = await db.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    res.status(200).json({
      success: true,
      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (error) {
    console.error("Get Order Details Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== CANCEL ORDER ====================
router.put("/:orderId/cancel", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    // Check if order belongs to user
    const [orders] = await db.execute(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: "Only pending orders can be cancelled" 
      });
    }

    // Update order status
    await db.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      ['cancelled', orderId]
    );

    // Get order items to restore stock
    const [orderItems] = await db.execute(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );

    // Restore stock
    for (let item of orderItems) {
      await db.execute(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
