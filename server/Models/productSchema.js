const db = require("../db/conn.js");
const productsData = require("../Constants/ProductData");

const DefaultData = async () => {
  try {
    const query = `
  INSERT INTO products 
  (name, description, price, mrp, discount, stock, category_id, image_url)
  VALUES ?
`;

    const values = productsData.map(p => [
      p.name,
      p.description,
      p.price,
      p.mrp,
      p.discount,
      p.stock,
      p.category_id,
      p.image_url
    ]);
    console.log("Values to insert:", values);

    db.query(query, [values], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
      } else {
        console.log(" Data inserted successfully");
      }
    });

  } catch (error) {
    console.error(error);
  }
};

module.exports = DefaultData;