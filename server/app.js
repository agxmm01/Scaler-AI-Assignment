require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db/conn.js");
const port = process.env.PORT || 8001;

const products = require("./Models/productSchema.js")

const DefaultData = require("./defaultdata.js");

const cors = require("cors");

const router = require("./Routes/Router.js");
app.use(express.json());
app.use(cors());
app.use("/", router);
// Test database connection
app.get("/api/health", (req, res) => {
    res.json({ message: "Server is running" });
});

app.listen(port, async () => {
    console.log(`Server is running on port number ${port}`);
    
    await DefaultData();
});

