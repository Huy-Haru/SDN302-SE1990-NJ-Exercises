const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  price_at_order: { type: Number, required: true, min: 0, validate: Number.isFinite },
  total: { type: Number, required: true, min: 0, validate: Number.isFinite }
}, { _id: false });
const schema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: { type: [itemSchema], required: true, validate: v => v.length > 0 },
  total_amount: { type: Number, required: true, min: 0, validate: Number.isFinite },
  payment_method: { type: String, required: true, trim: true },
  status: { type: String, required: true, trim: true },
  order_date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });
schema.index({ 'items.product_id': 1 });
module.exports = mongoose.model('Order', schema);
