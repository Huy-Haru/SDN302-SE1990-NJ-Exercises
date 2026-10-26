const express = require('express');
require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.get('/', (req, res) => res.json({ message: 'SDN302 Customer - Product - Order REST API' }));
app.use('/auth', require('./routes/auth'));
app.use('/api/products', require('./middleware/auth'), require('./routes/products'));
app.use('/api/orders', require('./middleware/auth'), require('./routes/orders'));
app.use((req, res) => res.status(404).json({ message: 'Endpoint not found' }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  if (err.name === 'ValidationError' || err.name === 'CastError') status = 400;
  if (err.code === 11000) status = 409;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? 'Internal server error' : err.message });
});
module.exports = app;
