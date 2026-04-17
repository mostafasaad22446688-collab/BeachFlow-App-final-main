const { User, Notification } = require("../models/index");

// 1. جلب قائمة طلبات الانضمام (للصفحة الأولى)
exports.getPendingAdmins = async (req, res) => {
    try {
        const pendingUsers = await User.findAll({
            where: { roleStatus: 'pending' },
            attributes: ['id', 'name', 'email', 'createdAt', 'roleStatus', 'idCardUrl'],
            order: [['createdAt', 'DESC']]
        });

        // حساب الإحصائيات للـ Cards اللي فوق في الصورة الأولى
        const totalPending = pendingUsers.length;
        const totalApproved = await User.count({ where: { roleStatus: 'approved' } });
        const totalRequests = await User.count({ where: { roleStatus: ['pending', 'approved', 'rejected'] } });

        res.status(200).json({
            success: true,
            stats: { totalRequests, totalApproved, totalPending },
            data: pendingUsers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. الموافقة أو الرفض (للصفحة الثانية - Modal)
exports.handleAdminAction = async (req, res) => {
    try {
        const { userId, action } = req.body; // action: 'approve' or 'reject'

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

        if (action === 'approve') {
            await user.update({
                role: 'admin',
                roleStatus: 'approved'
            });
            
            await Notification.create({
                userId: user.id,
                title: "تهانينا! تم قبول طلبك 🎊",
                message: `مرحباً ${user.name}، تمت الموافقة على طلبك بنجاح. يمكنك الآن الدخول لوحة التحكم وإدارة شاطئك.`,
                type: 'upgrade_user',
                isRead: false
            }).then(() => {
                console.log("🚀 Admin Approval Notification saved to Database!");
            });

            return res.status(200).json({ 
                success: true, 
                message: "تمت الموافقة بنجاح وإرسال الإشعار" 
            });

        } else if (action === 'reject') {
            await user.update({ roleStatus: 'rejected' });
            return res.status(200).json({ success: true, message: "تم رفض الطلب" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};