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

// ==================== GET CART ====================
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [cartItems] = await db.execute(
      `SELECT 
        c.id,
        c.product_id,
        c.quantity,
        p.name,
        p.price,
        p.mrp,
        p.discount,
        p.image_url,
        p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      cartItems: cartItems,
      itemCount: cartItems.length
    });

  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== ADD TO CART ====================
router.post("/add", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid product or quantity" });
    }

    // Check if product exists
    const [products] = await db.execute(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if product already in cart
    const [existingCart] = await db.execute(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existingCart.length > 0) {
      // Update quantity
      const newQuantity = existingCart[0].quantity + quantity;
      await db.execute(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [newQuantity, userId, productId]
      );
    } else {
      // Add new item
      await db.execute(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }

    // Get updated cart count
    const [cart] = await db.execute(
      "SELECT COUNT(*) as count FROM cart WHERE user_id = ?",
      [userId]
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartCount: cart[0].count
    });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== UPDATE CART QUANTITY ====================
router.put("/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    if (quantity > 100) {
      return res.status(400).json({ success: false, message: "Quantity cannot exceed 100" });
    }

    const [result] = await db.execute(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully"
    });

  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== REMOVE FROM CART ====================
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const [result] = await db.execute(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    // Get updated cart count
    const [cart] = await db.execute(
      "SELECT COUNT(*) as count FROM cart WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cartCount: cart[0].count
    });

  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==================== CLEAR CART ====================
router.delete("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await db.execute(
      "DELETE FROM cart WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
