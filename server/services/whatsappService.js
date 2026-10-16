
// import twilio from "twilio";

// const client = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
// );

// const sendWhatsAppNotification = async (message) => {
//     try {
//         const response = await client.messages.create({
//             from: process.env.TWILIO_WHATSAPP_FROM,
//             to: process.env.ADMIN_WHATSAPP_NUMBER,
//             body: message,
//         });

//         console.log("WhatsApp message sent:", response.sid);
//         return response;
//     } catch (error) {
//         console.error("WhatsApp notification failed:", error.message);
//         throw error;
//     }
// };

// export default sendWhatsAppNotification;
