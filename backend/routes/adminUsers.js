const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, number FROM users");
    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number } = req.body;
    await db.query(
      "UPDATE users SET name = ?, email = ?, number = ? WHERE id = ?",
      [name, email, number, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
