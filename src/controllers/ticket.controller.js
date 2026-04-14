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

        if (booking.status !== 'confirmed') {
            return res.status(403).json({ 
                message: "⚠️ لا يمكن عرض التذكرة؛ الحجز بانتظار الدفع أو تم إلغاؤه.",
                status: booking.status 
            });
        }

        const currentYear = new Date(booking.bookingDate).getFullYear();
        const formattedBookingId = `BEACH-${currentYear}-${booking.id}`;
        const ticketData = JSON.stringify({
            displayId: formattedBookingId, 
            bookingId: booking.id,        
            customer: booking.user.name,
            beach: booking.beach.name,
            date: booking.bookingDate,
            persons: booking.numberOfPersons,
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



