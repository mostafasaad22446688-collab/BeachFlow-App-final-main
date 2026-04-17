const User = require('./user.model');
const Beach = require('./beach.model');
const Booking = require('./booking.model');
const Favorite = require('./favorite.model');
const Notification = require('./notification.model');
const Review = require('./review.model');

Booking.belongsTo(Beach, { foreignKey: 'beachId', as: 'beach' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });


User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' }); 
Beach.hasMany(Booking, { foreignKey: 'beachId', as: 'bookings' }); 


User.hasMany(Beach, { foreignKey: 'adminId', as: 'beach' });
Beach.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Beach.hasMany(Favorite, { foreignKey: 'beachId', as: 'favoritedBy' });
Favorite.belongsTo(Beach, { foreignKey: 'beachId', as: 'beach' });


User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });


Beach.hasMany(Review, { foreignKey: 'beachId', as: 'reviews' });
Review.belongsTo(Beach, { foreignKey: 'beachId', as: 'beach' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { User, Beach, Booking, Notification, Favorite, Review }; 