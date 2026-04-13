const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: DataTypes.FLOAT, 
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'userId' 
    },
    beachId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'beachId'
    }
}, {
    timestamps: true 
});

module.exports = Review;