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
                beachName: booking.beach.name,             
                location:Beach.location,
                openingTime: Beach.openingTime,
                closingTime: Beach.closingTime,
                bookingDate: booking.bookingDate,
                qrCode: qrImage, 
                displayId: formattedBookingId,
                customerName: booking.user.name,
                numberOfPersons: booking.numberOfPersons,


            }
        });

    } catch (error) {
        next(error);
    }
};

exports.verifyAndCheckIn = async (req, res) => {
    try {
        const { identifier } = req.body;
        let booking;
 
        if (!isNaN(identifier)) {

            booking = await Booking.findByPk(identifier, {
                include: [{ model: Beach, as: 'beach' }, { model: User, as: 'user' }]
            });
        } else {
            const parts = identifier.split('-');
            const realId = parts[parts.length - 1];
            
            booking = await Booking.findByPk(realId, {
                include: [{ model: Beach, as: 'beach' }, { model: User, as: 'user' }]
            });
        }
        if (!booking) {
            return res.status(404).json({ success: false, message: "عذراً، لم يتم العثور على هذا الحجز." });
        }
        if (booking.status === 'checked_in') {
            return res.status(400).json({ 
                success: false, 
                message: "هذه التذكرة تم استخدامها بالفعل مسبقاً! ❌" 
            });
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({ 
                success: false, 
                message: "هذا الحجز غير مؤكد، لا يمكن تسجيل الدخول." 
            });
        }
        await booking.update({ status: 'checked_in' });
        await Notification.create({
            userId: booking.user.id,
            title: "استمتع بوقتك! 🌊",
            message: `تم تسجيل دخولك الآن في ${booking.beach.name}. نتمنى لك يوماً سعيداً!`,
            type: 'check_in_success',
            isRead: false
        }).catch(err => console.log("Notification Error:", err.message));

        const persons = booking.numberOfPersons || 1;
        const umbrellasNeeded = Math.ceil(persons / 3);
        const chairsNeeded = persons;
        const checkInDate = new Date();
        res.status(200).json({
            success: true,
            message: "تم التحقق من الحجز بنجاح ✅",
            data: {
                customerName: booking.user.name,
                beachName: booking.beach.name,
                numberOfPersons: persons,
                totalPrice: booking.totalPrice, 
                checkInTime: checkInDate, 
                resources: {
                    umbrellas: umbrellasNeeded,
                    chairs: chairsNeeded,
                    note: `تم تخصيص ${umbrellasNeeded} شمسية و ${chairsNeeded} كرسي لهذا الحجز.`
                }
            }
        });

    } catch (error) {
        console.error("Check-in Error:", error.message);
        res.status(500).json({ success: false, message: "حدث خطأ أثناء عملية التحقق." });
    }
};


