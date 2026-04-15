const { User, Notification } = require('../models/index');

// 1. جلب بيانات البروفايل (معدل لعرض الصورة)
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'otp'] } 
        });

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        // هيرجع البيانات شاملة الـ profilePic اللي ضفناه في الموديل
        res.status(200).json(user);
    } catch (error) {
        console.error("❌ FULL ERROR OBJECT:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error",
            stack: error.stack 
        });
    }
};

exports.editUserProfile = async (req, res, next) => {
    try {
        const { name, profilePic } = req.body;
        
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        // تحديث البيانات (الاسم والصورة)
        await user.update({
            name: name || user.name,
            profilePic: profilePic || user.profilePic 
        });

        // إشعار التحديث
        await Notification.create({
            userId: user.id,
            title: "تحديث الحساب 👤",
            message: `مرحباً ${user.name}، تم تحديث بياناتك بنجاح.`,
            type: 'edit_profile',
            isRead: false
        }).catch(err => console.log("⚠️ Notification Error:", err.message));

        res.status(200).json({
            message: "✅ تم تحديث بيانات البروفايل بنجاح",
            user: {
                id: user.id,
                name: user.name,
                profilePic: user.profilePic 
            }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
        }
        next(error);
    }
};



exports.submitAdminRequest = async (req, res) => {
    try {
        const { idCardUrl } = req.body; 
        const userId = req.user.id; 

        if (!idCardUrl) {
            return res.status(400).json({ message: "يرجى إرفاق صورة البطاقة" });
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

        // تحديث بيانات المستخدم
        await user.update({
            idCardUrl: idCardUrl,
            roleStatus: 'pending' 
        });
        await Notification.create({
            userId: user.id,
            title: "طلب إداري 👤",
            message: ` تم استلام طلبك بنجاح،وجاري مراجعته من قبل الإدارة.`,
            type: 'admin_request',
            isRead: false
        }).catch(err => console.log("⚠️ Notification Error:", err.message));


        res.status(200).json({
            success: true,
            message: "تم استلام طلبك بنجاح، جاري مراجعته من قبل الإدارة "
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};