const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  beachId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bookingDate: { type: DataTypes.DATEONLY, allowNull: false },
  paymobOrderId: {type: DataTypes.STRING,allowNull: true},
  totalPrice: {type: DataTypes.FLOAT,allowNull: false,},
  numberOfPersons: {type: DataTypes.INTEGER,allowNull: false,defaultValue: 1},
  status: {type: DataTypes.ENUM('pending', 'confirmed', 'checked_in'),defaultValue: 'pending'}
},
{timestamps: true, });
                                

module.exports = Booking;





