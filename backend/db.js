const mysql = require("mysql2");
require("dotenv").config();

// ✅ MySQL Connection Pool with Promises
const db = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mydb",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

// ✅ Test Connection
db.getConnection()
  .then(() => console.log("✅ Connected to FreeDB MySQL successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = db;
