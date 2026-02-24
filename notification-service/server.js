const amqp = require("amqplib");

const RABBIT_URI = process.env.RABBIT_URI || "amqp://localhost";

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBIT_URI);
    const channel = await connection.createChannel();
    const queue = "payment_notifications";

    await channel.assertQueue(queue, { durable: false });

    console.log(" Notification Service Waiting for messages...");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log(`\n RECEIVED EVENT: Payment Success!`);
        console.log(`   - Card: ${data.cardNumber}`);
        console.log(`   - Amount: $${data.amount}`);
        console.log(`   - Action: Sending Email receipt to user... [SIMULATED]`);
        
        channel.ack(msg); // Tell RabbitMQ we finished processing
      }
    });
  } catch (err) {
    console.error("RabbitMQ Connect Error (retrying in 5s):", err.message);
    setTimeout(startConsumer, 5000);
  }
}

startConsumer();