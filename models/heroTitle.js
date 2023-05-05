const mongoose = require('mongoose');

const heroTitleSchema = new mongoose.Schema({
  website: String,
  title: String
});

const HeroTitle = mongoose.model('HeroTitle', heroTitleSchema);

module.exports = HeroTitle;
