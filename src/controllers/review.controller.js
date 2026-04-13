const { Review, Beach, Notification } = require("../models/index");

exports.addReview = async (req, res, next) => {
    try {
        const { beachId, rating, comment } = req.body;
        const userId = req.user?.id;

        // ✅ التحقق من البيانات المدخلة
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is undefined. Please check your authentication token." });
        }

        if (!beachId) {
            return res.status(400).json({ success: false, message: "Beach ID is required" });
        }

        if (!rating || isNaN(parseFloat(rating))) {
            return res.status(400).json({ success: false, message: "Valid rating is required" });
        }

        // 1. إنشاء التقييم
        const newReview = await Review.create({
            rating: parseFloat(rating),
            comment: comment || "",
            userId: userId,
            beachId: parseInt(beachId)
        });

        // 2. حساب المتوسط يدوياً (أضمن من fn)
        const allReviews = await Review.findAll({ where: { beachId: parseInt(beachId) } });
        let newAverage = parseFloat(rating).toFixed(1);

        if (allReviews.length > 0) {
            const sum = allReviews.reduce((acc, rev) => acc + (parseFloat(rev.rating) || 0), 0);
            newAverage = (sum / allReviews.length).toFixed(1);
        }

        // 3. تحديث الشاطئ
        await Beach.update({ rating: newAverage }, { where: { id: beachId } });

        // 4. الإشعار (بنوع new_review)
        await Notification.create({
            userId: userId,
            title: "تقييم جديد 🌟",
            message: `شكراً لتقييمك! المتوسط الحالي: ${newAverage}`,
            type: 'new_review',
            isRead: false
        }).catch(err => console.log("Notification Error:", err.message));

        res.status(201).json({
            success: true,
            message: "تم حفظ التقييم بنجاح ✅",
            data: { newAverage }
        });

    } catch (error) {
        console.error("❌ Review Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


