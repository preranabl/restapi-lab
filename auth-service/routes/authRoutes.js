const express = require("express");
const User = require("../models/User");

const router = express.Router();

// --- EXISTING: LOGIN / REGISTER (POST) ---
router.post("/login", async (req, res) => {
  console.log("/auth/login HIT");
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email, password });
      await user.save();
      console.log("New user created");
    }
    // In a real app, you would verify password here
    return res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// --- NEW: GET ALL USERS (GET) ---
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NEW: GET SINGLE USER (GET) ---
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NEW: UPDATE USER (PUT) ---
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    // We use { new: true } to return the updated object
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email }, 
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NEW: DELETE USER (DELETE) ---
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;