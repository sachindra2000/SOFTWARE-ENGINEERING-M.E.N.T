// Import dependencies
require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2'); // Import mysql2 module
const express = require("express"); // Import express module
const passport = require('passport'); // Import passport module
const flash = require('connect-flash'); // Import connect-flash module
const session = require('express-session'); // Import express-session module

// Import routes
const deleteCityRoutes = require("./models/repositories/deleteCity");  // Import the route to delete a city
const deleteCountryRoutes = require("./models/repositories/deleteCountry");  // Import the route to delete a country
const deleteLanguageRoutes = require("./models/repositories/deleteLanguage");  // Import the route to delete a language
const countriesRoutes = require("./models/repositories/countries");  // Import the route to add a country
const citiesRoutes = require("./models/repositories/cities");  // Import the route to add a city
const languagesRoutes = require("./models/repositories/languages");  // Import the route to add a language
const capitalsRoutes = require("./models/repositories/capitals");  // Import the route to add a capital
const cityRoutes = require("./models/routes/city"); // Import city routes
const countryRoutes = require("./models/routes/country"); // Import country routes
const contactRoutes = require('./models/routes/contact'); // Import contact routes
const capitalRoutes = require("./models/routes/capital"); // Import capital routes
const languageRoutes = require("./models/routes/language"); // Import language routes
const populationRoutes = require("./models/routes/populations"); // Import population report route
const authenticationRoutes = require('./models/helpers/authentication'); // Import authentication routes
const initializePassport = require('./models/helpers/passport-config'); // Import passport-config
const { checkAuthenticated, checkNotAuthenticated } = require('./models/helpers/authMiddleware'); // Import authentication middleware
const checkAdmin = require('./models/helpers/checkAdmin'); // Import checkAdmin middleware


// Create express instance
const app = express();
const port = 3000;

// Setup session and passport
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key for session
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: { secure: false } // False for development, true for production
}));

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306 // Default MySQL port
});

// Setup middleware, view engine, etc.
app.use(flash()); // Use flash messages
app.set('views', './views/pages'); // Set views directory
app.use(passport.session()); // Use passport session
app.use(passport.initialize()); // Use passport
app.use(express.static('static')); // Serve static files from static directory
app.set('view engine', 'pug'); // Set view engine to pug
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use('/', contactRoutes); // Use contact routes for the application


// Use the routes by passing the app and db as arguments
countryRoutes(app, db, { checkAuthenticated, checkNotAuthenticated, checkAdmin }); // Use country routes
cityRoutes(app, db, { checkAuthenticated, checkNotAuthenticated, checkAdmin }); // Use city routes
capitalRoutes(app, db, { checkAuthenticated, checkNotAuthenticated, checkAdmin }); // Use capital routes
languageRoutes(app, db, { checkAuthenticated, checkNotAuthenticated, checkAdmin }); // Use language routes
populationRoutes(app, db, { checkAuthenticated, checkNotAuthenticated, checkAdmin }); // Use population report route
authenticationRoutes(app, db); // Use authentication routes
initializePassport(passport, db); // Initialize passport
countriesRoutes(app); // Use the route to add a country
capitalsRoutes(app); // Use the route to add a capital
citiesRoutes(app); // Use the route to add a city
languagesRoutes(app); // Use the route to add a language
deleteCityRoutes(app); // Use the route to delete a city
deleteCountryRoutes(app); // Use the route to delete a country
deleteLanguageRoutes(app); // Use the route to delete a language

// Home Page route
app.get('/', (req, res) => {
    res.render('index', { 
        user: req.user, // Check if Admin is logged in
        isAuthenticated: req.isAuthenticated() // Check if user is authenticated
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.logOut(function(err) { 
      if (err) { return next(err); } 
      req.session.destroy(() => {  // Destroy session
        res.clearCookie('connect.sid'); // Clear cookie
        res.redirect('/'); // Redirect to home page
      });
    });
});

// Database connection errors
db.connect(error => {
    if (error) {
        console.error('Database connection error:', error);
        return;
    }
    console.log('Successfully connected to the database.');
});

// Run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});