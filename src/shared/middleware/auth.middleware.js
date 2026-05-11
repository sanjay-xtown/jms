<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

/**
 * JWT Authentication Middleware
 * Protects routes by verifying the token
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Authentication required. Please provide a token.', 401);
=======
const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
  }

  const token = authHeader.split(' ')[1];

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Invalid or expired token.', 401);
=======
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
  }
};

module.exports = authMiddleware;
