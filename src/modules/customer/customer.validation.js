<<<<<<< HEAD
const Joi = require('joi');

/**
 * Customer Validation Schemas
 */
const customerValidation = {
  create: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(10).max(15).required(),
    address: Joi.string().optional(),
  }),

  update: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().min(10).max(15).optional(),
    address: Joi.string().optional(),
    kycStatus: Joi.string().valid('Pending', 'Verified', 'Rejected').optional(),
  }),
};

module.exports = customerValidation;
=======
exports.createCustomer = (req, res, next) => {
  next();
};
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
