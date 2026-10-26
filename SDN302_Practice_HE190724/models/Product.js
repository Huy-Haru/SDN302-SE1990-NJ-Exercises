const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0, validate: Number.isFinite },
  category: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0, validate: Number.isFinite }
}, { timestamps: true });
module.exports = mongoose.model('Product', schema);
