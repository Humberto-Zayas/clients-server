const mongoose = require('mongoose');
const HeroTitle = require('./models/heroTitle');

// Connect to the MongoDB server
mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Demo hero titles for each of the three websites
const heroTitles = [
  { website: 'website1', title: 'Welcome to Website 1!' },
  { website: 'website2', title: 'Discover Website 2' },
  { website: 'website3', title: 'Experience Website 3' }
];

// Function to seed the database with the demo hero titles
async function seedDatabase() {
  try {
    await HeroTitle.deleteMany(); // Clear the collection
    const result = await HeroTitle.insertMany(heroTitles); // Insert the demo hero titles
    console.log(`Successfully seeded database with ${result.length} hero titles`);
    mongoose.connection.close(); // Close the database connection
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close(); // Close the database connection
  }
}

seedDatabase(); // Call the seedDatabase function
