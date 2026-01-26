const express = require("express");
const mongoose = require("mongoose"); // Import mongoose
const cors = require("cors");
require("dotenv").config(); // Ensure dotenv is used

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/payment", paymentRoutes);

// Connect to MongoDB (Ensure you have MONGO_URI in your .env or Docker environment)
// Note: In Docker Compose, you might use mongodb://mongo:27017/payment_db
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/payment_db"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Payment DB connected"))
  .catch(err => console.error("DB error:", err));

app.listen(5002, () => {
  console.log("Payment service running on port 5002");
});