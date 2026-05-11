<<<<<<< HEAD
const ApiResponse = require('../utils/apiResponse');

/**
 * Centralized Error Handling Middleware
 * Catches all errors and returns a formatted JSON response
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error]: ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Sequelize Unique Constraint Errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }

  // Handle Joi Validation Errors
  if (err.isJoi) {
    statusCode = 400;
    message = err.details.map((d) => d.message).join(', ');
  }

  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
=======
const logger = require('../../config/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (req.t) {
    if (statusCode === 500) message = req.t('internalServer', { ns: 'error', defaultValue: message });
    else if (statusCode === 401) message = req.t('unauthorized', { ns: 'error', defaultValue: message });
    else if (statusCode === 403) message = req.t('forbidden', { ns: 'error', defaultValue: message });
    else if (statusCode === 404) message = req.t('notFound', { ns: 'error', defaultValue: message });
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
