# 🏖️ BeachFlow - Beach Booking & Management System

> A comprehensive backend API for a modern beach booking and management platform, built with Node.js and Express

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![Express](https://img.shields.io/badge/Express-4.22-blue.svg)
![Database](https://img.shields.io/badge/Database-MySQL%2FPostgreSQL-orange.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Database](#database)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - JWT-based authentication with role-based access control
- 🏖️ **Beach Management** - Complete CRUD operations for beach listings
- 📅 **Booking System** - Advanced reservation management with availability tracking
- ⭐ **Reviews & Ratings** - User reviews and rating system for beaches
- ❤️ **Favorites** - Add beaches to personal favorite lists
- 📧 **Email Notifications** - OTP verification and booking notifications
- 💳 **Payment Integration** - Secure payment processing
- 👥 **User Management** - Comprehensive user profile and role management
- 🎫 **Ticket Generation** - QR code ticket generation for bookings
- 📊 **Admin Dashboard** - Super admin controls and analytics
- 🔔 **Real-time Notifications** - Notification system for users
- 📱 **Multi-role Support** - Users, Admins, and Super Admins

### Security Features
- Password encryption with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API routes with middleware
- Error handling and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.22
- **Database**: MySQL 2 / PostgreSQL
- **ORM**: Sequelize 6.37
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs
- **Email Service**: Nodemailer
- **QR Code**: qrcode
- **Utilities**: Axios, CORS, Morgan, Body Parser
- **Development**: Nodemon

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/) or [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BeachFlow-App.git
cd BeachFlow-App-final-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=beachflow_db
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql  # or postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@beachflow.com

# Payment Gateway (if applicable)
PAYMENT_API_KEY=your_payment_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE beachflow_db;
EXIT;
```

### 5. Start the Application

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
BeachFlow-App-final-main/
├── src/
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── controllers/                 # Business logic
│   │   ├── auth.controller.js
│   │   ├── beach.controller.js
│   │   ├── booking.controller.js
│   │   ├── favorite.controller.js
│   │   ├── notification.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   ├── user.controller.js
│   │   ├── superAdmin.controller.js
│   │   └── ticket.controller.js
│   ├── middleware/                  # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── superAdmin.middleware.js
│   │   └── error.middleware.js
│   ├── models/                      # Database models
│   │   ├── user.model.js
│   │   ├── beach.model.js
│   │   ├── booking.model.js
│   │   ├── review.model.js
│   │   ├── favorite.model.js
│   │   ├── notification.model.js
│   │   └── index.js
│   ├── routes/                      # API routes
│   │   ├── auth.routes.js
│   │   ├── beach.routes.js
│   │   ├── booking.routes.js
│   │   ├── review.routes.js
│   │   ├── user.routes.js
│   │   ├── payment.routes.js
│   │   ├── protected.routes.js
│   │   ├── superAdmin.routes.js
│   │   ├── notification.routes.js
│   │   └── ticket.routes.js
│   └── utils/
│       └── sendOTPEmail.js          # Email utility functions
├── app.js                           # Express app configuration
├── server.js                        # Server entry point
├── package.json
├── .env.example                     # Example environment variables
└── README.md
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment type | `development` or `production` |
| `DB_HOST` | Database host | `localhost` |
| `DB_NAME` | Database name | `beachflow_db` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your_password` |
| `JWT_SECRET` | JWT secret key | `your_secret_key` |
| `EMAIL_USER` | Email address for sending OTPs | `your_email@gmail.com` |
| `EMAIL_PASSWORD` | Email password/app password | `your_app_password` |

## 📡 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Beach Endpoints
- `GET /api/beaches` - Get all beaches
- `GET /api/beaches/:id` - Get beach details
- `POST /api/beaches` - Create beach (Admin)
- `PUT /api/beaches/:id` - Update beach (Admin)
- `DELETE /api/beaches/:id` - Delete beach (Admin)

### Booking Endpoints
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/:id/ticket` - Generate ticket

### Review Endpoints
- `POST /api/reviews` - Create a review
- `GET /api/reviews/:beachId` - Get beach reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user details (Admin)

### Favorite Endpoints
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:beachId` - Remove from favorites

### Payment Endpoints
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:id` - Get payment status

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/bookings` - Manage bookings

## 🗄️ Database

The application uses **Sequelize ORM** for database abstraction, supporting both MySQL and PostgreSQL.

### Database Models
- **User** - User accounts and profiles
- **Beach** - Beach information and details
- **Booking** - Reservation records
- **Review** - User reviews and ratings
- **Favorite** - User favorite beaches
- **Notification** - User notifications
- **Payment** - Payment transactions
- **Ticket** - Booking tickets

### Auto-Sync
Sequelize automatically syncs models with the database on server startup.

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. User registers/logs in
2. Server generates JWT token
3. Client includes token in Authorization header
4. Server verifies token on protected routes

### Token Format
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **USER** - Regular user
- **ADMIN** - Beach administrator
- **SUPER_ADMIN** - System administrator

## 🔧 Running the Application

### Development Mode
```bash
npm run dev
```
- Auto-restarts on file changes
- Enhanced logging

### Production Mode
```bash
npm start
```

### Check Server Status
```bash
curl http://localhost:3000/api/health
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

## 🐛 Troubleshooting

### Connection Issues
- Verify database credentials in `.env`
- Ensure MySQL/PostgreSQL is running
- Check database exists

### Port Already in Use
```bash
# Change PORT in .env or
killall node  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Email Not Sending
- Enable "Less secure app access" (Gmail)
- Use app-specific password
- Verify SMTP credentials

## 📖 Documentation

For detailed API documentation, refer to:
- [API Routes](./src/routes/)
- [Controllers](./src/controllers/)
- [Models](./src/models/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Author**: Mohamed
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Project**: [BeachFlow App](https://github.com/yourusername/BeachFlow-App)

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database ORM: [Sequelize](https://sequelize.org/)
- Authentication: [JWT](https://jwt.io/)

---

<div align="center">

**[⬆ Back to Top](#beachflow---beach-booking--management-system)**

Made with ❤️ by Mohamed

</div>
