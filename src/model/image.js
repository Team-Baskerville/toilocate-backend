const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = Schema({
  imageId: String,
  index: Number,
  url: String,
});

module.exports = mongoose.model('images', ImageSchema);
