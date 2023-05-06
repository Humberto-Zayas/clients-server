const mongoose = require('mongoose');

const heroTitleSchema = new mongoose.Schema({
  website: { type: String, required: true },
  title: { type: String, required: true },
});

const getHeroTitleModel = (website) => {
  return mongoose.model(`HeroTitle_${website}`, heroTitleSchema, `heroTitles_${website}`);
};

module.exports = getHeroTitleModel;
