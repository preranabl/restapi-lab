const express = require("express");
const router = express.Router();

router.post("/process", (req, res) => {
  console.log("💰 Payment request received");
  console.log("BODY:", req.body);
  res.json({ message: "Payment processed successfully" });
});

module.exports = router;
