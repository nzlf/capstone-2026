require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const projectRoutes = require('./routes/projectRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://kidscenter.id',
    'https://www.kidscenter.id',
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'ALHAMDULILLAH SERVER IS RUNNING',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;