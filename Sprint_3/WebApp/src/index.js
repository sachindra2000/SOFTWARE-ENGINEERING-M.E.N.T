// Import dependencies
const express = require("express");
const mysql = require("mysql2");


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


// Home Page route
app.get("/", (req, res) => {
  res.render("index");
});

// Run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});