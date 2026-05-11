const { z } = require('zod');

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

exports.validateRegister = (req, res, next) => {
  try {
    req.body = registerSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: req.t ? req.t('validationFailed', { ns: 'validation' }) : 'Validation failed',
      errors: error.errors
    });
  }
};

exports.validateLogin = (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: req.t ? req.t('validationFailed', { ns: 'validation' }) : 'Validation failed',
      errors: error.errors
    });
  }
};
