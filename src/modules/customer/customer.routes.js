const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const CustomerController = require('./customer.controller');
const customerValidation = require('./customer.validation');

/**
 * Validation Middleware Helper
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return next(error);
  next();
};

/**
 * Customer Routes
 */
router.post('/', validate(customerValidation.create), CustomerController.create);
router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getById);
router.patch('/:id', validate(customerValidation.update), CustomerController.update);
router.delete('/:id', CustomerController.delete);
=======
const customerController = require('./customer.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');
const authorizeRoles = require('../../shared/middleware/role.middleware');

router.use(authMiddleware);

router.get('/search', customerController.searchCustomers);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);

router.post(
  '/',
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  customerController.createCustomer
);

router.put(
  '/:id',
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  customerController.updateCustomer
);

router.delete(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  customerController.deleteCustomer
);
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0

module.exports = router;
