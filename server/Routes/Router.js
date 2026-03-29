const express = require("express");
const router = express.Router();
const db = require("../db/conn.js");

/// ✅ FIRST: dynamic route
router.get("/getProducts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ THEN: list route
router.get("/getProducts", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

module.exports = router;