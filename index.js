const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const HeroTitle = require('./models/heroTitle');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const router = express.Router();
const session = require('express-session');

const app = express();
const port = 5001;

// Static credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

// Set up Passport for authentication
passport.use(new LocalStrategy(async (username, password, done) => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return done(null, { username: ADMIN_USERNAME });
  }
  return done(null, false, { message: 'Incorrect username or password' });
}));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  if (username === ADMIN_USERNAME) {
    return done(null, { username: ADMIN_USERNAME });
  }
  return done(new Error('User not found'));
});

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
app.use(cors({
  origin: 'http://localhost:3000', // Replace this with your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Set up session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if you are using HTTPS
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ isAuthenticated: true });
});

// Route to update the hero title for a website
app.post('/hero-title/:website', passport.authenticate('local', { session: false }), async (req, res) => {
  const { website } = req.params;
  const { title } = req.body;

  try {
    const heroTitle = await HeroTitle.findOneAndUpdate({ website }, { title }, { new: true });
    if (!heroTitle) {
      return res.status(404).json({ error: `Hero title not found for website '${website}'` });
    }
    res.json(heroTitle);
  } catch (err) {
    console.error('Error updating hero title:', err);
    res.status(500).json({ error: 'Error updating hero title' });
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
