const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/payment", paymentRoutes);

app.listen(5002, () => {
  console.log("🚀 Payment service running on port 5002");
});
