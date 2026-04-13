const QRCode = require('qrcode');
const { Booking, Beach, User,Notification } = require("../models/index");

exports.generateTicket = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: Beach, as: 'beach' },
                { model: User, as: 'user' }
            ]
        });

        if (!booking) return res.status(404).json({ message: "عفواً، الحجز غير موجود" });

        // ⚠️ القفل الجديد: لو الحجز مش مؤكد، ارفض توليد الـ QR
        if (booking.status !== 'confirmed') {
            return res.status(403).json({ 
                message: "⚠️ لا يمكن عرض التذكرة؛ الحجز بانتظار الدفع أو تم إلغاؤه.",
                status: booking.status 
            });
        }

        // لو تمام (confirmed)، ولد الـ QR Code
        const ticketData = JSON.stringify({
            ticketId: booking.id,
            customer: booking.user.name,
            beach: booking.beach.name,
            date: booking.bookingDate,
            status: booking.status
        });

        const qrImage = await QRCode.toDataURL(ticketData);
            await Notification.create({
            userId: booking.user.id,
            title: "توليد التذكرة 🎟️",
            message: ` ✅تم توليد تذكرتك بنجاح استمتع بيومك!`,
            type: 'ticket_generated',
            isRead: false
        }).catch(err => console.log("⚠️ Notification Error:", err.message));
        res.status(200).json({
            message: "تم توليد التذكرة بنجاح ",
            data: {
                bookingId: booking.id,
                qrCode: qrImage

            }
        });

    } catch (error) {
        next(error);
    }
};



// exports.generateTicket = async (req, res, next) => {
//     try {
//         const { bookingId } = req.params;
//         const booking = await Booking.findByPk(bookingId, {
//             include: [
//                 { model: Beach, as: 'beach' },
//                 { model: User, as: 'user' }
//             ]
// });

//         if (!booking) {
//             return res.status(404).json({ message: "عفواً، لا يوجد حجز بهذا الرقم" });
//         }

//         if (!booking.user || !booking.beach) {
//             return res.status(400).json({ 
//                 message: "بيانات الحجز غير مكتملة (يوجد نقص في بيانات المستخدم أو الشاطئ)",
//                 debug: {
//                     hasUser: !!booking.user,
//                     hasBeach: !!booking.beach
//                 }
//             });
//         }

//         // 4. لو كله تمام، ولد الـ QR Code
//         const ticketData = JSON.stringify({
//             ticketId: booking.id,
//             customer: booking.user.name,
//             beach: booking.beach.name,
//             date: booking.bookingDate,
//             status: booking.status
//         });

//         const qrImage = await QRCode.toDataURL(ticketData);

//         res.status(200).json({
//             message: "تم توليد التذكرة",
//             data: {
//                 bookingId: booking.id,
//                 customerName: booking.user.name, 
//                 beachName: booking.beach.name,   
//                 date: booking.bookingDate,
//                 totalPrice: booking.totalPrice,
//                 status: booking.status,
//                 qrCode: qrImage
//             }
//         });

//     } catch (error) {
//         console.error("Ticket Error:", error);
//         next(error);
//     }
// };