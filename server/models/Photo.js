const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Különböző fotó keresési indexek létrehozása
PhotoSchema.index({ name: 1 });
PhotoSchema.index({ uploadDate: -1 });
PhotoSchema.index({ user: 1, uploadDate: -1 });

module.exports = mongoose.model('Photo', PhotoSchema);
