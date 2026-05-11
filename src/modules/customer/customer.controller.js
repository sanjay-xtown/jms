<<<<<<< HEAD
const CustomerService = require('./customer.service');
const ApiResponse = require('../../shared/utils/apiResponse');

/**
 * Customer Controller
 * Handles HTTP requests and calls the appropriate service
 */
class CustomerController {
  async create(req, res, next) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      return ApiResponse.success(res, 'Customer created successfully', customer, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const customers = await CustomerService.getAllCustomers();
      return ApiResponse.success(res, 'Customers retrieved successfully', customers);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      return ApiResponse.success(res, 'Customer retrieved successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const customer = await CustomerService.updateCustomer(req.params.id, req.body);
      return ApiResponse.success(res, 'Customer updated successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await CustomerService.deleteCustomer(req.params.id);
      return ApiResponse.success(res, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
=======
const customerService = require('./customer.service');

const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body, req.user.id);
    return res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;
    const customers = await customerService.searchCustomers(q);
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
};
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
