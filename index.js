const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const HeroTitle = require('./models/heroTitle');

const app = express();
const port = 5001;

// Connect to the MongoDB server
mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Define a route to handle POST requests to change the hero title
app.post('/hero-title/:website', async (req, res) => {
  const website = req.params.website;
  const newTitle = req.body.title;

  try {
    let heroTitle = await HeroTitle.findOne({ website: website });

    if (!heroTitle) {
      heroTitle = new HeroTitle({ website: website, title: newTitle });
    } else {
      heroTitle.title = newTitle;
    }

    await heroTitle.save();

    return res.status(200).send(`Hero title for '${website}' updated to '${newTitle}'`);
  } catch (err) {
    console.error('Error updating hero title:', err);
    return res.status(500).send(err);
  }
});

// Define a route to handle GET requests for the hero title
app.get('/hero-title/:website', async (req, res) => {
  const website = req.params.website;

  try {
    const heroTitle = await HeroTitle.findOne({ website: website });

    if (!heroTitle) {
      return res.status(404).send(`Hero title for '${website}' not found`);
    }

    return res.status(200).send(heroTitle.title);
  } catch (err) {
    console.error('Error retrieving hero title:', err);
    return res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
