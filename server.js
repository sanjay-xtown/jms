const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, connectDB } = require('./src/config/db');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const i18next = require('./src/shared/utils/i18n');
const middleware = require('i18next-http-middleware');
app.use(middleware.handle(i18next));

// API Routes
app.use('/api', routes);

// Health-check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "SDRS Gold Finance ERP API Running"
  });
});

// Sync and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('✅ Database Synced');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
  }
};

startServer();
