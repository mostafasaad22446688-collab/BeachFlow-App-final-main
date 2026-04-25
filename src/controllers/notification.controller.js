const { Notification } = require('../models');
const { Op } = require('sequelize');

exports.getUserNotifications = async (req, res) => {
    try {

        const userId = req.user.id; 
        const userCreatedAt = req.user.createdAt; 
        const notifications = await Notification.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { userId: userId },
                            { userId: null }
                        ]
                    },
                    {
                        createdAt: {
                            [Op.gte]: userCreatedAt 
                        }
                    }
                ]
            },
            attributes: ['id', 'title', 'message', 'type', 'link', 'createdAt'], 
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "فشل في جلب الإشعارات" });
    }
};

