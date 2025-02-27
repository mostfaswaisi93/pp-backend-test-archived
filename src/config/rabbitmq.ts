import dotenv from "dotenv";
import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { EventEmitter } from "events";

dotenv.config();

if (!process.env.RABBITMQ_APL) {
  throw new Error("RabbitMQ URL is not provided in environment variables");
}

const exchangeName = "dispatchboard";
const routingKey = "processupdates";

const timecardQueue = "timecard";
const emailQueue = "emailqueue";
const promoImageQueue = "promoimage";
const equipmentQueue = "equipment-queue";
const invoiceQueue = "invoice-queue";

let connection: Connection | null = null;
let channel: Channel | null = null;

const EM = new EventEmitter();

async function startConnection(): Promise<Channel | null> {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_APL!);
    channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct", { durable: false });
    const q = await channel.assertQueue("", { exclusive: true });

    channel.bindQueue(q.queue, exchangeName, routingKey);

    await Promise.all([
      channel.assertQueue(timecardQueue, { durable: true }),
      channel.assertQueue(emailQueue, { durable: true }),
      channel.assertQueue(equipmentQueue, { durable: true }),
      channel.assertQueue(invoiceQueue, { durable: true }),
      channel.assertQueue(promoImageQueue, { durable: true }),
    ]);

    return channel;
  } catch (e) {
    console.error("Error in RabbitMQ connection:", e);
    return null;
  }
}

(async () => {
  try {
    await startConnection();
    console.log("RabbitMQ Connected");
    EM.emit("connected");
  } catch (e) {
    console.error("Error in establishing RabbitMQ connection:", e);
  }
})();

async function sendMessage(payload: object): Promise<void> {
  try {
    if (channel) {
      channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      console.log(`Job sent successfully => ${JSON.stringify(payload)}`);
    }
  } catch (e) {
    console.error("Error sending message:", e);
  }
}

async function sendEmailWork(payload: object): Promise<void> {
  try {
    if (channel) {
      await channel.sendToQueue(
        emailQueue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      console.log(`Email job sent successfully => ${JSON.stringify(payload)}`);
    }
  } catch (e) {
    console.error("Error sending email message:", e);
  }
}

async function sendPromoImage(payload: object): Promise<void> {
  try {
    if (channel) {
      await channel.sendToQueue(
        promoImageQueue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      console.log(
        `Promo image job sent successfully => ${JSON.stringify(payload)}`
      );
    }
  } catch (e) {
    console.error("Error sending promo image job:", e);
  }
}

async function sendEquipmentBooking(payload: object): Promise<void> {
  try {
    if (channel) {
      await channel.sendToQueue(
        equipmentQueue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      console.log(
        `Equipment booking job sent successfully => ${JSON.stringify(payload)}`
      );
    }
  } catch (e) {
    console.error("Error sending equipment booking job:", e);
  }
}

async function sendInvoice(payload: object): Promise<void> {
  try {
    if (channel) {
      await channel.sendToQueue(
        invoiceQueue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
      console.log(
        `Invoice job sent successfully => ${JSON.stringify(payload)}`
      );
    }
  } catch (e) {
    console.error("Error sending invoice job:", e);
  }
}

async function consumeMessages(): Promise<void> {
  try {
    if (channel === null) {
      throw new Error("Channel is not initialized");
    }

    const q = await channel.assertQueue("", { exclusive: true });
    console.log(`Waiting for messages in queue ${q.queue}`);
    channel.bindQueue(q.queue, exchangeName, routingKey);

    channel.consume(q.queue, (msg: ConsumeMessage | null) => {
      if (msg) {
        console.log(`Received message: ${msg.content.toString()}`);

        if (channel) {
          channel.ack(msg);
        }
      }
    });
  } catch (e) {
    console.error("Error consuming messages:", e);
  }
}

function getChannel() {
  return { channel, timecardQueue };
}

function getEmailChannel() {
  return { channel, emailQueue };
}

function getPromoImageChannel() {
  return { channel, promoImageQueue };
}

function getEquipmentChannel() {
  return { channel, equipmentQueue };
}

function getInvoiceChannel() {
  return { channel, invoiceQueue };
}

export {
  sendMessage,
  getChannel,
  sendEmailWork,
  getEmailChannel,
  sendPromoImage,
  getPromoImageChannel,
  sendEquipmentBooking,
  getEquipmentChannel,
  sendInvoice,
  getInvoiceChannel,
  consumeMessages,
  EM,
};
