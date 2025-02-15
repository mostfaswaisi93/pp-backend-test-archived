// import amqp from "amqplib/callback_api";

// // إعداد الاتصال بـ RabbitMQ
// class RabbitMQService {
//   private connection: amqp.Connection | null = null;
//   private channel: amqp.Channel | null = null;

//   constructor() {
//     this.connect();
//   }

//   // الاتصال بـ RabbitMQ
//   private connect() {
//     amqp.connect(
//       process.env.RABBITMQ_URL || "amqp://localhost",
//       (err, connection) => {
//         if (err) {
//           console.error("خطأ في الاتصال بـ RabbitMQ:", err);
//           return;
//         }

//         this.connection = connection;

//         // إنشاء قناة جديدة
//         connection.createChannel((err, channel) => {
//           if (err) {
//             console.error("خطأ في إنشاء قناة RabbitMQ:", err);
//             return;
//           }

//           this.channel = channel;

//           // تحديد اسم الطابور (queue)
//           const queueName = "test_queue";
//           channel.assertQueue(queueName, {
//             durable: false,
//           });

//           console.log(`قمت بالاتصال بـ RabbitMQ والطابور: ${queueName}`);
//         });
//       }
//     );
//   }

//   // إرسال رسالة إلى الطابور
//   sendMessage(message: string) {
//     if (this.channel) {
//       const queueName = "test_queue";
//       this.channel.sendToQueue(queueName, Buffer.from(message));
//       console.log(`تم إرسال الرسالة: ${message}`);
//     } else {
//       console.error("لا توجد قناة مفتوحة للاتصال بـ RabbitMQ");
//     }
//   }

//   // استقبال رسائل من الطابور
//   receiveMessage() {
//     if (this.channel) {
//       const queueName = "test_queue";
//       this.channel.consume(
//         queueName,
//         (msg) => {
//           if (msg) {
//             console.log(`تم استلام الرسالة: ${msg.content.toString()}`);
//           }
//         },
//         { noAck: true }
//       );
//     }
//   }

//   // إغلاق الاتصال
//   closeConnection() {
//     if (this.connection) {
//       this.connection.close();
//     }
//   }
// }

// export default new RabbitMQService();
