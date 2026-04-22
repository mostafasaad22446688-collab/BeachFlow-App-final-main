const { User, Notification } = require("../models/index");

exports.getPendingAdmins = async (req, res) => {
    try {
        const allrequests = await User.findAll({
            where: { roleStatus: ['pending', 'approved', 'rejected'] },
            attributes: ['id', 'name', 'email', 'createdAt', 'roleStatus', 'idCardUrl'],
        });

        allrequests.sort((a, b) => {
            if (a.roleStatus === 'pending' && b.roleStatus !== 'pending') return -1;
            if (a.roleStatus !== 'pending' && b.roleStatus === 'pending') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const totalRequests = allrequests.length;
        const totalPending = await User.count({ where: { roleStatus: 'pending' } });
        const totalApproved = await User.count({ where: { roleStatus: 'approved' } });


        res.status(200).json({
            success: true,
            stats: { totalRequests, totalApproved, totalPending },
            data: allrequests
        });
    } catch (error) {
        console.error("❌ Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.handleAdminAction = async (req, res) => {
    try {
        const { userId, action } = req.body;
        const dashboardUrl = "https://beach-flow-dashboard.vercel.app";
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
                link: dashboardUrl
            }).then(() => {
                console.log("🚀 Admin Approval Notification saved to Database!");
            });

            return res.status(200).json({ 
                success: true, 
                message: "تمت الموافقة بنجاح وإرسال الإشعار" 
            });

        } else if (action === 'reject') {
            await user.update({ roleStatus: 'rejected' });
            await Notification.create({
                userId: user.id,
                title: "عتذر! تم رفض طلبك 😔",
                message: `مرحباً ${user.name}، تم رفض طلبك. يمكنك إعادة التقديم في وقت لاحق.`,
                type: 'upgrade_user'
            })
            return res.status(200).json({ success: true, message: "تم رفض الطلب" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};