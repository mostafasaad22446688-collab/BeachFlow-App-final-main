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

// 2. تعديل بيانات البروفايل (معدل لإضافة/تحديث الصورة)
exports.editUserProfile = async (req, res, next) => {
    try {
        // بنستقبل الـ profilePic من الـ body
        const { name, profilePic } = req.body;
        
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        // تحديث البيانات (الاسم والصورة)
        await user.update({
            name: name || user.name,
            profilePic: profilePic || user.profilePic // لو مبعتش صورة جديدة يحافظ على القديمة
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
                profilePic: user.profilePic // نرجعه عشان يتحدث فوراً في الفلاتر
            }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
        }
        next(error);
    }
};














// const { User,Notification } = require('../models/index');

// // 1. جلب بيانات البروفايل
// exports.getUserProfile = async (req, res, next) => {
//     try {
//         const user = await User.findByPk(req.user.id, {
//             attributes: { exclude: ['password','otp'] } 
//         });

//         if (!user) {
//             return res.status(404).json({ message: "المستخدم غير موجود" });
//         }

//         res.status(200).json(user);
//   } catch (error) {
//     console.error("❌ FULL ERROR OBJECT:", error); // هيطبع لك تفاصيل الخطأ كاملة في Railway
//     res.status(500).json({ 
//         success: false, 
//         message: error.message || "Internal Server Error",
//         stack: error.stack // ده هيقولك السطر اللي فيه المشكلة بالظبط
//     });
// }
// };

// // 2. تعديل بيانات البروفايل
// exports.editUserProfile = async (req, res, next) => {
//     try {
//         const { name } = req.body;
        
//         const user = await User.findByPk(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: "المستخدم غير موجود" });
//         }
//         await user.update({
//             name: name || user.name,
//         });
//         await Notification.create({
//             userId: user.id,
//             title: "تحديث الحساب 👤",
//             message: `مرحباً ${name}، تم تحديث اسمك بنجاح في النظام.`,
//             type: 'edit_profile',
//             isRead: false
//         }).catch(err => console.log("⚠️ Notification Error:", err.message));
//         res.status(200).json({
//             message: "✅ تم تحديث بيانات البروفايل بنجاح",
//             user: {
//                 id: user.id,
//                 name: user.name
//             }
//         });
//     } catch (error) {
//         if (error.name === 'SequelizeUniqueConstraintError') {
//             return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
//         }
//         next(error);
//     }
// };