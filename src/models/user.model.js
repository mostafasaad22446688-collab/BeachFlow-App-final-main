const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  roleStatus: {type: DataTypes.ENUM('none', 'pending', 'approved', 'rejected'),defaultValue: 'none'},
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING },
  profilePic: {type: DataTypes.STRING,allowNull: true,defaultValue: "https://example.com/default-avatar.png"},
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  idCardUrl: {type: DataTypes.STRING,allowNull: true}
});