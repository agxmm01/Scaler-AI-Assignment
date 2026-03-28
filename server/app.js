require("dotenv").config();
const express = require("express");
const app = express();

const port = 8001;
app.listen(port,() =>  {
    console.log(`Server is running on port number ${port}`);
});