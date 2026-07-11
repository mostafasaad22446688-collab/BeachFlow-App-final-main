
const { connectDB, sequelize } = require("./src/config/db"); 
require('dotenv').config(); 
const app = require("./app"); 

const start = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log("✅ Database updated Successfully!");
  } catch (err) {
    console.error("❌ SQL Sync or Connection Error Details:");
    console.error(err); 
    process.exit(1); 
  }
};

start();

module.exports = app;

