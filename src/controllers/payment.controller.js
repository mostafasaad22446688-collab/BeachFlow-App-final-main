const axios = require('axios');
const { Booking, User, Notification } = require("../models/index");

exports.initiatePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findByPk(bookingId, {
            include: [{ model: User, as: 'user' }]
        });

        if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });
        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: process.env.PAYMOB_API_KEY
        });
        const token = authResponse.data.token;
        const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: "false",
            amount_cents: booking.totalPrice * 100, 
            currency: "EGP",
            items: [] 
        });
        const orderId = orderResponse.data.id;
        await Booking.update({ paymobOrderId: orderId.toString() }, { where: { id: bookingId } });
        const paymentKeyResponse = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: booking.totalPrice * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                first_name: booking.user.name.split(' ')[0] || "Guest",
                last_name: booking.user.name.split(' ')[1] || "User",
                email: booking.user.email,
                phone_number: "01000000000", 
                street: "NA", building: "NA", floor: "NA", apartment: "NA", city: "NA", country: "NA"
            },
            currency: "EGP",
            integration_id: process.env.PAYMOB_INTEGRATION_ID
        });

        const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKeyResponse.data.token}`;

        res.status(200).json({ paymentUrl });
    } 
    catch (error) {
    if (error.response) {
        console.error("Paymob Error Details:", error.response.data);
    } else {
        console.error("Error Message:", error.message);
    }
    res.status(500).json({ message: "فشل الاتصال ببوابة الدفع" });
}
};

exports.paymentWebhook = async (req, res) => {
    try {
        if (!req.body) {
            console.log("❌ Error: No body received in request");
            return res.status(400).send("No body");
        }
        const obj = req.body.obj;
        if (!obj) {
            console.log("⚠️ Warning: req.body.obj is undefined");
            return res.status(200).send("<h1>Success! Returning to app...</h1>");
        }
        const paymobOrderId = obj.order && obj.order.id ? obj.order.id.toString() : null;
        if (!paymobOrderId) {
            console.log("❌ Error: Could not find order.id in Paymob object");
            return res.status(200).send("ok");
        }

        console.log(`🔍 Searching for Booking with Paymob ID: ${paymobOrderId}`);
        const booking = await Booking.findOne({ where: { paymobOrderId: paymobOrderId } });

        if (booking) {
            if (obj.success === true) {
                await booking.update({ status: 'confirmed' });
                console.log(`✅ Booking #${booking.id} UPDATED TO CONFIRMED`);
                const beachName = booking.beach ? booking.beach.name : "الشاطئ";
                
                await Notification.create({
                    userId: booking.userId,
                    title: "تم تأكيد الحجز ✅",
                    message: `تمت عملية الدفع بنجاح لشاطئ ${beachName}. تذكرتك جاهزة!`,
                    type: 'payment_success',
                    isRead: false
                }).then(() => {
                    console.log("🚀 Notification saved to Database!");
                }).catch(err => {
                    console.log("❌ Notification DB Error:", err.message);
                });

            } else {
                console.log(`🛑 Payment failed for Booking #${booking.id}`);
            }
        } else {
            console.log(`❌ No Booking found with Paymob ID: ${paymobOrderId}`);
        }

        res.status(200).send("ok");

    } catch (error) {
        console.error("❌ Fatal Webhook Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
};





