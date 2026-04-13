const { Favorite, Beach } = require('../models/index');


exports.toggleFavorite = async (req, res, next) => {
    try {
        const  {beachId}  = req.body;
        const userId = req.user.id;
        const existingFav = await Favorite.findOne({ where: { userId, beachId } });

        if (existingFav) {
            await existingFav.destroy();
            return res.status(200).json({ message: "تمت الإزالة من المفضلات" });
        }

        await Favorite.create({ userId, beachId });
        res.status(201).json({ message: "تمت الإضافة إلى المفضلات" });
    } catch (error) {
        next(error);
    }
};

// 2. عرض مفضلات اليوزر
exports.getUserFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.findAll({
            where: { userId: req.user.id },
            include: [{ model: Beach, as: 'beach' }]
        });
        res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};
