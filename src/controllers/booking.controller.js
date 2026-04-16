const { Booking, Beach, Notification } = require("../models/index");

exports.createBooking = async (req, res) => {
    try {
        const { beachId, bookingDate, numberOfPersons } = req.body;
        const userId = req.user.id; 
        const beach = await Beach.findByPk(beachId);
        if (!beach) {
            return res.status(404).json({ 
                success: false, 
                message: "عذراً، هذا الشاطئ غير موجود" 
            });
        }

        const count = parseInt(numberOfPersons) || 1; 
        const totalPrice = beach.price * count;
        const newBooking = await Booking.create({
            beachId,
            userId,
            bookingDate,
            numberOfPersons: count,
            totalPrice: totalPrice, 
            status: 'pending' 
        });

        await Notification.create({
            userId: userId,
            title: "تم تجهيز حجزك 🎟️",
            message: `حجزك لعدد ${count} أفراد في ${beach.name} جاهز. المبلغ الإجمالي: ${totalPrice} جنيه.`,
            type: 'info',
            isRead: false
        }).catch(err => console.log("Notification Error:", err.message));

        res.status(201).json({
            success: true,
            message: "تم إنشاء طلب الحجز بنجاح",
            data: {
                bookingId: newBooking.id,
                totalAmount: totalPrice,
                beachName: beach.name,
                date: bookingDate
            }
        });

    } catch (error) {
        console.error("🔥 Error in createBooking:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "حدث خطأ أثناء معالجة الحجز",
            error: error.message 
        });
    }
};

exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [{ model: Beach, as: 'beach', attributes: ['name', 'location', 'imageUrl'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب الحجوزات" });
    }
};

exports.getBeachBookings = async (req, res) => {
    try {
        // الأدمن اللي داخل بيشوف بس حجوزات الشاطئ بتاعه
        const adminId = req.user.id; 

        const bookings = await Booking.findAll({
            include: [
                {
                    model: Beach,
                    as: 'beach',
                    where: { userId: adminId } // تأكد إن الشاطئ ملك للأدمن ده
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email'] // بيانات العميل المطلوبة في الصورة
                }
            ],
            order: [['createdAt', 'DESC']] // الأحدث يظهر الأول
        });

        // تحويل البيانات لشكل يتناسب مع التصميم اللي بعته
        const formattedBookings = bookings.map(booking => {
            const persons = booking.numberOfPersons || 1;
            return {
                id: booking.id,
                bookingCode: `BK-2026-${booking.id}`,
                status: booking.status, 
                customer: {
                    name: booking.user.name,
                    email: booking.user.email
                },
                details: {
                    date: booking.date,
                    time: "8:00 صباحاً - 2:00 مساءً", 
                    persons: persons,
                    umbrellas: Math.ceil(persons / 3), 
                    chairs: persons 
                },
                totalPrice: booking.totalPrice
            };
        });

        res.status(200).json({
            success: true,
            count: formattedBookings.length,
            data: formattedBookings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
