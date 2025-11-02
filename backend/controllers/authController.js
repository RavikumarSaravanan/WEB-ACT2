import { ApiError } from '../middleware/errorHandler.js';

/**
 * Auth Controller
 * Handles admin authentication
 */

/**
 * Admin login
 * POST /api/admin/login
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Simple authentication (in production, use hashed passwords in database)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      // Create session
      req.session.isAdmin = true;
      req.session.username = username;

      res.json({
        success: true,
        message: 'Login successful',
        data: { username }
      });
    } else {
      throw new ApiError(401, 'Invalid username or password');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Admin logout
 * POST /api/admin/logout
 */
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out'
      });
    }

    res.json({
      success: true,
      message: 'Logout successful',
      data: null
    });
  });
};

/**
 * Check authentication status
 * GET /api/admin/status
 */
export const getStatus = (req, res) => {
  if (req.session && req.session.isAdmin) {
    res.json({
      success: true,
      message: 'User is authenticated',
      data: { 
        isAdmin: true, 
        username: req.session.username 
      }
    });
  } else {
    res.json({
      success: false,
      message: 'User is not authenticated',
      data: { isAdmin: false }
    });
  }
};

