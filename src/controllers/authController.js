const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_flutter_mongodb';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate JWT Token helper
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Handle User Signup
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password,
      name: name ? name.trim() : ''
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Signup successful!',
      token,
      user: newUser.toJSON()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: err.message
    });
  }
};

/**
 * Handle User Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);
    const userJson = user.toJSON();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken: null,
      user: {
        id: userJson.id,
        email: userJson.email,
        name: userJson.name || ''
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: err.message
    });
  }
};

/**
 * Get Authenticated User Profile
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: err.message
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile
};
