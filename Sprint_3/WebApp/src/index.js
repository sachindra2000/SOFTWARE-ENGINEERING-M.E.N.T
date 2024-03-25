// Import dependencies
const express = require("express");
const mysql = require("mysql2");
const countryRoutes = require("./models/country"); // Import country routes
const cityRoutes = require("./models/city"); // Import city routes
const capitalRoutes = require("./models/capital"); // Import capital routes
const languageRoutes = require("./models/language"); // Import language routes
const populationRoutes = require("./models/populations"); // Import population report route


// Create express instance
const app = express();
const port = 3000;

// Setup database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: "user",
  password: "password",
  database: "world",
});

// Setup middleware, view engine, etc.
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('static'));

// Use the routes by passing the app and db as arguments
countryRoutes(app, db);
cityRoutes(app, db);
capitalRoutes(app, db);
languageRoutes(app, db);
populationRoutes(app, db);

// Home Page route
app.get("/", (req, res) => {
  res.render("index");
});

// Run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
