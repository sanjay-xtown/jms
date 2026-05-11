const { Op, fn, col, literal } = require('sequelize');
const Customer = require('../../models/customer.model');
const GoldLoan = require('../../models/goldLoan.model');
const Payment = require('../../models/payment.model');
const Ledger = require('../../models/ledger.model');
const GoldRate = require('../../models/goldRate.model');

const getSummary = async () => {
  const [
    totalRevenue,
    totalActiveLoans,
    totalCustomers,
    totalPendingAmount,
    totalGoldStock,
    totalPaymentsReceived,
    latestGoldRate
  ] = await Promise.all([
    Payment.sum('paymentAmount') || 0,
    GoldLoan.count({ where: { status: 'ACTIVE' } }),
    Customer.count(),
    GoldLoan.sum('remainingPrincipal') || 0,
    GoldLoan.sum('goldWeight', { where: { status: 'ACTIVE' } }) || 0,
    Payment.count(),
    GoldRate.findOne({
      where: { status: 'ACTIVE' },
      order: [['createdAt', 'DESC']]
    })
  ]);

  const liveRate = latestGoldRate ? latestGoldRate.gold22KRate : 0;
  const totalGoldStockValue = Math.max(0, totalGoldStock * liveRate);

  return {
    totalRevenue: Math.max(0, totalRevenue),
    totalActiveLoans,
    totalCustomers,
    totalPendingAmount: Math.max(0, totalPendingAmount),
    totalGoldStockValue,
    totalPaymentsReceived
  };
};

const getAnalytics = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [monthlyLoanTrends, monthlyPaymentTrends] = await Promise.all([
    GoldLoan.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: { createdAt: { [Op.gte]: sixMonthsAgo } },
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
      raw: true
    }),
    Payment.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('paymentAmount')), 'total']
      ],
      where: { createdAt: { [Op.gte]: sixMonthsAgo } },
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
      raw: true
    })
  ]);

  // Simplified Growth Percentage Logic (Current Month vs Previous Month)
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const prevMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

  const [currentMonthRev, prevMonthRev, currentMonthLoans, prevMonthLoans] = await Promise.all([
    Payment.sum('paymentAmount', { where: { createdAt: { [Op.gte]: currentMonthStart } } }) || 0,
    Payment.sum('paymentAmount', { where: { createdAt: { [Op.between]: [prevMonthStart, currentMonthStart] } } }) || 0,
    GoldLoan.count({ where: { createdAt: { [Op.gte]: currentMonthStart } } }),
    GoldLoan.count({ where: { createdAt: { [Op.between]: [prevMonthStart, currentMonthStart] } } })
  ]);

  const calculateGrowth = (current, prev) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return parseFloat(((current - prev) / prev * 100).toFixed(2));
  };

  return {
    monthlyLoanTrends,
    monthlyPaymentTrends,
    revenueGrowthPercentage: calculateGrowth(currentMonthRev, prevMonthRev),
    loanGrowthPercentage: calculateGrowth(currentMonthLoans, prevMonthLoans)
  };
};

const getActivity = async () => {
  const [latestTransactions, latestLoans, latestPayments] = await Promise.all([
    Ledger.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: Customer, as: 'customer', attributes: ['firstName', 'lastName'] }]
    }),
    GoldLoan.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Customer, as: 'customer', attributes: ['firstName', 'lastName'] }]
    }),
    Payment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: GoldLoan, as: 'loan', include: [{ model: Customer, as: 'customer', attributes: ['firstName', 'lastName'] }] }]
    })
  ]);

  return {
    latestTransactions,
    latestLoans,
    latestPayments,
    latestApprovals: latestLoans.filter(l => l.status === 'ACTIVE')
  };
};

const getCharts = async () => {
  const [loanStatusDist, paymentMethodDist, monthlyRevenue] = await Promise.all([
    GoldLoan.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true
    }),
    Payment.findAll({
      attributes: ['paymentMethod', [fn('COUNT', col('id')), 'count']],
      group: ['paymentMethod'],
      raw: true
    }),
    Payment.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('paymentAmount')), 'total']
      ],
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
      limit: 12,
      raw: true
    })
  ]);

  return {
    loanStatusDistribution: loanStatusDist,
    paymentMethodDistribution: paymentMethodDist,
    monthlyRevenueLineChart: monthlyRevenue,
    loanVsPaymentComparison: {
      loans: loanStatusDist.reduce((acc, curr) => acc + parseInt(curr.count), 0),
      payments: paymentMethodDist.reduce((acc, curr) => acc + parseInt(curr.count), 0)
    }
  };
};

module.exports = {
  getSummary,
  getAnalytics,
  getActivity,
  getCharts
};
