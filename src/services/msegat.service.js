// import axios from "axios";

// const sendSMS = async ({ phone, message }) => {
//   try {
//     const response = await axios.post(
//       "https://www.msegat.com/gw/sendsms.php",
//       {
//         userName: process.env.MSEGAT_USERNAME,
//         apiKey: process.env.MSEGAT_API_KEY,
//         numbers: phone,              // must be 966XXXXXXXXX
//         userSender: process.env.MSEGAT_SENDER,
//         msg: message,
//         msgEncoding: "UTF8",         // REQUIRED
//         timeToSend: "now"
//       },
//       {
//         headers: {
//           "Content-Type": "application/json"
//         },
//         timeout: 10000
//       }
//     );
//     console.log("Sender:", process.env.MSEGAT_SENDER);
//     console.log("SMS SENT:", response.data);

//     return response.data;

//   } catch (error) {
//     console.error("MSEGAT ERROR:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export default {
//   sendSMS
// };


import axios from "axios";

const sendSMS = async ({ phone, message }) => {
  try {

    const payload = {
      userName: process.env.MSEGAT_USERNAME,
      apiKey: process.env.MSEGAT_API_KEY,
      numbers: phone,
      userSender: process.env.MSEGAT_SENDER,
      msg: message,
      msgEncoding: "UTF8",
      timeToSend: "now"
    };

    // Debug log
    console.log("MSEGAT PAYLOAD:", payload);

    const response = await axios.post(
      "https://www.msegat.com/gw/sendsms.php",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    console.log("SMS RESPONSE:", response.data);

    return response.data;

  } catch (error) {
    console.error("MSEGAT ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  sendSMS
};