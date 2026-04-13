const axios = require('axios'); 
const sendOTPEmail = async (email, otp) => {
  try {
    const apiKey = process.env.BREVO_API_KEY; 
    const data = {
      sender: { name: "Beach Flow", email: "mostafasaad22446688@gmail.com" }, 
      to: [{ email: email }],
      subject: "Verification Code - Beach Flow",
      htmlContent: `<html><body><h1>Your Code: ${otp}</h1></body></html>`
    };
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log("✅ Email Sent via API! ID:", response.data.messageId);
  } catch (error) {
    console.error("❌ API Error:", error.response ? error.response.data : error.message);
  }
};
module.exports = sendOTPEmail;
