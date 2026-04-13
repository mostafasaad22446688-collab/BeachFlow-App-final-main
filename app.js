const express = require("express");
const cors = require("cors");
const app = express();
const notificationRoutes = require('./src/routes/notification.routes'); 
const userRouter = require('./src/routes/user.routes'); 


app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/beach", require("./src/routes/beach.routes"));
app.use("/api/bookings", require("./src/routes/booking.routes"));
app.use("/api/payment", require("./src/routes/payment.routes"));
app.use("/api/tickets", require("./src/routes/ticket.routes"));
app.use('/api/favorites', require('./src/routes/favorite.routes'));
app.use('/api/notifications', notificationRoutes);
app.use("/api/reviews", require("./src/routes/review.routes"));
app.use(require("./src/middleware/error.middleware"));
module.exports = app;



