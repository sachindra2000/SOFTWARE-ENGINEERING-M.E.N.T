// Export a connection to the database and a function to run a query 
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
});

// Function to run a query
const runQuery = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
    });
});

module.exports = { db, runQuery };  // Export both db and runQuery
