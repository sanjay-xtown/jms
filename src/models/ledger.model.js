const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Ledger = sequelize.define('Ledger', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionType: {
    type: DataTypes.ENUM('DEBIT', 'CREDIT'),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'INTEREST_PAYMENT', 'EXPENSE', 'INCOME', 'OTHER'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  runningBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  loanId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  paymentId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'ledgers',
});

// Associations
const Customer = require('./customer.model');
const GoldLoan = require('./goldLoan.model');
const Payment = require('./payment.model');

Ledger.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Ledger.belongsTo(GoldLoan, { foreignKey: 'loanId', as: 'loan' });
Ledger.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

Customer.hasMany(Ledger, { foreignKey: 'customerId', as: 'ledgers' });
GoldLoan.hasMany(Ledger, { foreignKey: 'loanId', as: 'ledgers' });
Payment.hasMany(Ledger, { foreignKey: 'paymentId', as: 'ledgers' });

module.exports = Ledger;
