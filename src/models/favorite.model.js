const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    
});

module.exports = Favorite;
