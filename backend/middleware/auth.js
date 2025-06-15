const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// Authentication Middleware
function auth(req, res, next) {
  
  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({error:'Invalid or expired token'})
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({error:'Authorization header missing or invalid'})
  }
}

function isAdmin(req, res, next) {
  
  if (req.user.role === "admin") {
    return next();
  }
  res.status(403).json({error:'Forbidden'})
}

module.exports = { auth, isAdmin };