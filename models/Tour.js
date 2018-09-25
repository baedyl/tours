const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TourSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number
  },
  price: {
    type: Number
  },
  days: [ String ],
  img: { 
    data: Buffer,
    contentType: String
  }
});

// Create collection and add schema
mongoose.model('tours', TourSchema);