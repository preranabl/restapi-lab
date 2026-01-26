const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Completed" },
}, { timestamps: true });

module.exports = mongoose.model("payment", paymentSchema);