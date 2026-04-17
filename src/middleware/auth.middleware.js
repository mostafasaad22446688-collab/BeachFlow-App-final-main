const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1️⃣ جلب token من headers
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 2️⃣ Token بيكون بالشكل: "Bearer TOKEN"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // 3️⃣ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};


module.exports = authMiddleware;