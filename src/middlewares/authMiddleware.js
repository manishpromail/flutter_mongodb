const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_flutter_mongodb';

/**
 * Middleware to authenticate requests using JWT
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: jwtErr.message
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Attach user and raw token to request object (matches Supabase format)
    req.user = user.toJSON();
    req.token = token;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate token',
      error: err.message
    });
  }
};

/**
 * Optional authentication middleware: attaches user if token is present and valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user.toJSON();
          req.token = token;
        }
      } catch (e) {
        // Ignore invalid token for optional auth
      }
    }
  } catch (e) {
    // Pass through
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
