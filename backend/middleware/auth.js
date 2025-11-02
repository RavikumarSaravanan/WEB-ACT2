import { ApiError } from './errorHandler.js';

/**
 * Authentication middleware for admin routes
 * Checks if user is authenticated via session
 */

export const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  
  throw new ApiError(401, 'Authentication required. Please log in.');
};

