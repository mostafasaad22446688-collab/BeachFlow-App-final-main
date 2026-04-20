
const { Beach,Notification } = require("../models/index");
const  {Op}  = require("sequelize");

// 1. جلب كل الشواطئ
exports.getAll = async (req, res, next) => {
    try {
        const beaches = await Beach.findAll({ order: [['createdAt', 'DESC']] }); // الترتيب من الأحدث
        res.status(200).json(beaches);
    } catch (error) {
        next(error);
    }
};

// 2. جلب شاطئ واحد
exports.getOne = async (req, res, next) => {
    try {
        const beach = await Beach.findByPk(req.params.id);
        if (!beach) return res.status(404).json({ message: "هذا الشاطئ غير موجود" });
        res.status(200).json(beach);
    } catch (error) {
        next(error);
    }
};

// 3. إضافة شاطئ جديد (للأدمن)
exports.addBeach = async (req, res, next) => {
    try {
        const { name, location, price, description, imageUrl,maxCapacity, openingTime, closingTime } = req.body;
        const newBeach = await Beach.create({
            name, location, price, description, imageUrl,maxCapacity,openingTime, closingTime,
            availableCapacity: maxCapacity,
            adminId: req.user.id 
        });
        await Notification.create({
            title:'تم إضافة شاطئ جديد! 🏖️',
            message: `تم إضافة شاطئ "${name}" في "${location}". احجز مكانك الآن!`, 
            type: 'beach_added',
            userId: null 
        });
        res.status(201).json({ message: "تم إضافة الشاطئ بنجاح", beach: newBeach });
    } 
    catch (error) {
        next(error);
    }
};


// 4. البحث عن شاطئ (Search)
exports.getSearch = async (req, res, next) => {
  try {
    let { q } = req.query; 
    
    if (!q) {
      return res.status(400).json({ message: "برجاء إدخال كلمة للبحث" });
    }

    q = q.trim(); 

    const beaches = await Beach.findAll({
  where: {
    [Op.or]: [
      { name: { [Op.iLike]: `%${q}%` } },     
      { location: { [Op.iLike]: `%${q}%` } }  
    ]
  }
});

    res.status(200).json(beaches);
  } catch (error) {
    console.error("SQL Search Error:", error); 
    next(error);
  }
};
// 5. شواطئ الأدمن الحالي فقط
exports.getMyBeaches = async (req, res, next) => {
    try {
        const beaches = await Beach.findAll({
            where: { adminId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ status: "success", results: beaches.length, data: beaches });
    } catch (error) {
        next(error);
    }
};

// 6. تحديث (تعديل)
exports.updateBeach = async (req, res, next) => {
    try {
        const beach = await Beach.findOne({ where: { id: req.params.id, adminId: req.user.id } });
        if (!beach) return res.status(404).json({ message: "الشاطئ غير موجود أو غير مصرح لك" });

        // تعديل البيانات المختارة فقط للأمان
        const { name, location, price, description, imageUrl } = req.body;
        await beach.update({ name, location, price, description, imageUrl });
        await Notification.create({
            title: 'تم تعديل بيانات شاطئك!🏖️',
            message: `تم إضافة شاطئ "${name}" في "${location}". احجز مكانك الآن!`, 
            type: 'beach_updated',
            userId: null 
        });
        res.status(200).json({ message: "تم التحديث بنجاح", beach });
    } catch (error) {
        next(error);
    }
    };

// 7. حذف
exports.deleteBeach = async (req, res, next) => {
    try {
        const beach = await Beach.findOne({ where: { id: req.params.id, adminId: req.user.id } });

        await beach.destroy();
        res.status(200).json({ message: "تم حذف الشاطئ بنجاح" });
    } catch (error) {
        next(error);
    }
};

exports.getTopRatedBeaches = async (req, res, next) => {
    try {
        const topBeaches = await Beach.findAll({
            order: [['rating', 'DESC']], 
            limit: 6
        });

        res.status(200).json({
            success: true,
            count: topBeaches.length,
            data: topBeaches
        });
    } catch (error) {
        console.error("Error fetching top rated beaches:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب الشواطئ الأعلى تقييماً" });
        error.message
    }
};
