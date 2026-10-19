const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  body: { type: String, required: [true, 'Comment body is required.'] },
  date: { type: Date, default: Date.now },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Articles' }
});
module.exports = mongoose.model('Comment', commentSchema);
