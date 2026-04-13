const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('beach_added', 'beach_updated','payment_success','edit_profile','ticket_generated','new_review'),
        defaultValue: 'beach_added'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Notifications' 
});

module.exports = Notification;