<<<<<<< HEAD
/**
 * Notification Model Definition
 * SDRS Gold Finance & Jewelry ERP System
 */

=======
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
<<<<<<< HEAD
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM(
        'DUE_REMINDER',
        'PAYMENT_ALERT',
        'CHIT_FUND_ALERT',
        'CHIT_FUND_COMPLETION',
        'GOLD_LOAN_INTEREST'
      ),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
=======
      primaryKey: true
    },
    message: DataTypes.TEXT,
    type: DataTypes.STRING,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
>>>>>>> 80625032da0853259748299ae1b213d25b9ac9d0
  });

  return Notification;
};
