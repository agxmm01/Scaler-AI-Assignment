const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.log("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.log("Database has too many connections.");
        }
        if (err.code === "ER_ACCESS_DENIED_ERROR") {
            console.log("Database authentication failed.");
        }
    }

    if (connection) connection.release();
    console.log("✅ MySQL connected successfully.");
});

module.exports = pool.promise(); 