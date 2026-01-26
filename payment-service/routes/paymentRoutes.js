const express = require("express");
const Payment = require("../models/payment");
const amqp = require("amqplib"); 

const router = express.Router();

// --- RABBITMQ SETUP ---
let channel;
const RABBIT_URI = process.env.RABBIT_URI || "amqp://localhost";
const QUEUE_NAME = "payment_notifications";

async function connectRabbit() {
  try {
    const connection = await amqp.connect(RABBIT_URI);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    console.log("Payment Service Connected to RabbitMQ"); // <--- LOOK FOR THIS LOG
  } catch (err) {
    console.error("RabbitMQ Connection Failed:", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectRabbit, 5000); // <--- THIS IS THE MAGIC FIX
  }
}
connectRabbit(); 

// --- CREATE PAYMENT (POST) ---
router.post("/process", async (req, res) => {
  console.log("Payment request received");
  try {
    const { cardNumber, amount } = req.body;
    if(!cardNumber || !amount) return res.status(400).json({message: "Missing fields"});

    const newPayment = new Payment({ cardNumber, amount });
    await newPayment.save();

    // PUBLISH TO RABBITMQ
    if (channel) {
      const eventData = {
        id: newPayment._id,
        cardNumber: cardNumber,
        amount: amount,
        date: new Date()
      };
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(eventData)));
      console.log("Event Published to RabbitMQ"); // <--- THIS WILL APPEAR NOW
    } else {
      console.error("Cannot publish: RabbitMQ channel is missing.");
    }

    res.status(201).json({ message: "Payment processed", payment: newPayment });
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
});

// --- KEEP OTHER ROUTES THE SAME ---
router.get("/history", async (req, res) => { try { const p = await Payment.find(); res.json(p); } catch(e){res.status(500).json(e)} });
router.get("/history/:id", async (req, res) => { try { const p = await Payment.findById(req.params.id); if(!p) return res.sendStatus(404); res.json(p); } catch(e){res.status(500).json(e)} });
router.put("/history/:id", async (req, res) => { try { const p = await Payment.findByIdAndUpdate(req.params.id, req.body, {new:true}); if(!p) return res.sendStatus(404); res.json(p); } catch(e){res.status(500).json(e)} });
router.delete("/history/:id", async (req, res) => { try { const p = await Payment.findByIdAndDelete(req.params.id); if(!p) return res.sendStatus(404); res.json({msg:"Deleted"}); } catch(e){res.status(500).json(e)} });

module.exports = router;