const { connectDB, sequelize } = require("./src/config/db"); 
require('dotenv').config(); 
const app = require("./app"); 


const start = async () => {
  await connectDB();
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database updated Successfully!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" SQL Sync Error Details:");
    console.error(err); 
    process.exit(1); 
  });
};
start();


