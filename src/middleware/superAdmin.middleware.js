const isSuperAdmin = (req, res, next) => {

  if (req.user && req.user.role === 'superAdmin') {
    next(); 
  } else {
    return res.status(403).json({ 
      message: "Access denied. SuperAdmin privileges required." 
    });
  }
};

module.exports =  isSuperAdmin ;