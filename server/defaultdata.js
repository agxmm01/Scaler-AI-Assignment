const db = require("./db/conn.js");
const productsData = require("./Constants/ProductData");

const DefaultData = async () => {
  try {
    console.log("🔥 Seeding started");

    // ✅ Step 1: Check if data already exists
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM products");

    if (rows[0].count > 0) {
      console.log("⚠️ Data already exists, skipping seeding");
      return;
    }

    // ✅ Step 2: Insert only if empty
    for (let i = 0; i < productsData.length; i++) {
      const p = productsData[i];

      const [result] = await db.execute(
        `INSERT INTO products 
        (name, description, price, mrp, discount, stock, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.name,
          p.description,
          p.price,
          p.mrp,
          p.discount,
          p.stock,
          p.category_id,
          String(p.image_url)
        ]
      );

      console.log("Inserted ID:", result.insertId);
    }

    console.log("✅ Data inserted successfully");

  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

module.exports = DefaultData;