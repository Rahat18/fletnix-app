const mongoose = require('mongoose');

const NetflixTitleSchema = new mongoose.Schema({
  show_id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  director: {
    type: String
  },
  country: {
    type: String
  },
  date_added: {
    type: String
  },
  release_year: {
    type: Number
  },
  rating: {
    type: String
  },
  duration: {
    type: String
  },
  listed_in: {
    type: String
  },
  description: {
    type: String
  }
}, { collection: 'netflix_titles' });

module.exports = mongoose.model('NetflixTitle', NetflixTitleSchema);
