const express = require("express");
const router = express.Router();
const db = require("../db/conn.js");

// ==================== SEARCH PRODUCTS ====================
router.get("/search", async (req, res) => {
  try {
    const { q, page = 1, limit = 12, category, sort = "relevance", order = "desc" } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query required" });
    }

    const offset = (page - 1) * limit;
    const searchTerm = `%${q}%`;

    let query = `SELECT * FROM products 
                 WHERE (name LIKE ? OR description LIKE ?)`;
    let countQuery = `SELECT COUNT(*) as count FROM products 
                      WHERE (name LIKE ? OR description LIKE ?)`;
    let params = [searchTerm, searchTerm];

    // Filter by category
    if (category) {
      query += " AND category_id = ?";
      countQuery += " AND category_id = ?";
      params.push(category);
    }

    // Sort
    if (sort === "price_low") {
      query += " ORDER BY price ASC";
    } else if (sort === "price_high") {
      query += " ORDER BY price DESC";
    } else if (sort === "discount") {
      query += " ORDER BY discount DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [products] = await db.execute(query, params);

    // Get total count
    const countParams = params.slice(0, params.length - 2).filter((_, i) => i < (category ? 3 : 2));
    const [totalCount] = await db.execute(countQuery, countParams);

    res.status(200).json({
      success: true,
      products: products,
      query: q,
      total: totalCount[0].count,
      pagination: {
        total: totalCount[0].count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });

  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({ success: false, message: "Error searching products" });
  }
});

// ==================== GET CATEGORIES ====================
router.get("/categories/list", async (req, res) => {
  try {
    const [categories] = await db.execute(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.status(200).json({
      success: true,
      categories: categories
    });

  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
});

// ==================== GET ALL PRODUCTS ====================
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 12, category, sort = "latest" } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM products WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as count FROM products WHERE 1=1";
    let params = [];

    // Filter by category
    if (category) {
      query += " AND category_id = ?";
      countQuery += " AND category_id = ?";
      params.push(category);
    }

    // Sort
    if (sort === "price_asc") {
      query += " ORDER BY price ASC";
    } else if (sort === "price_desc") {
      query += " ORDER BY price DESC";
    } else if (sort === "discount") {
      query += " ORDER BY discount DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [products] = await db.execute(query, params);

    // Get total count
    const [totalCount] = await db.execute(countQuery, params.slice(0, -2));

    res.status(200).json({
      success: true,
      products: products,
      pagination: {
        total: totalCount[0].count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// ==================== GET SINGLE PRODUCT ====================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product: products[0]
    });

  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
