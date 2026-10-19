const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Article title is required.'],
    minlength: [5, 'Title must be at least 5 characters.'],
    trim: true
  },
  date: { type: Date, default: Date.now, required: [true, 'Article date is required.'] },
  text: {
    type: String,
    required: [true, 'Article text is required.'],
    validate: { validator: v => v.length > 10, message: 'Article text must be longer than 10 characters.' }
  },
  tags: {
    type: [String],
    validate: { validator: v => v && v.length > 0, message: 'There should be at least 1 tag.' }
  }
});
module.exports = mongoose.model('Articles', articleSchema);
