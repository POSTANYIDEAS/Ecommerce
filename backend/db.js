const mysql = require("mysql2");
require("dotenv").config();

// ✅ Use promise() wrapper to support async/await
const db = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mydb",
  })
  .promise();

module.exports = db;
