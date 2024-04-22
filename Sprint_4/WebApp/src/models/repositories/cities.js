// This file contains the routes for adding a new city to the database
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin');

module.exports = function(app) {
    // Route to render the form for adding a new city
    app.get('/admin/add-city-form', checkAdmin, (req, res) => {
        res.render('addCity', {
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            messages: {
                error: req.flash('error')
            }
        });
    });

    // Handle the POST request to add a new city
    app.post("/add-city", async (req, res) => {
        const { name, countryCode, district, population } = req.body;
        try {
            // Check if city already exists in the same country
            const existsSql = "SELECT ID FROM city WHERE Name = ? AND CountryCode = ?";
            const exists = await runQuery(existsSql, [name, countryCode]);
            if (exists.length > 0) {
                req.flash('error', 'City already exists in this country.');
                return res.redirect('/admin/add-city-form');
            }
            // Insert the new city into the database
            const insertSql = "INSERT INTO city (Name, CountryCode, District, Population) VALUES (?, ?, ?, ?)";
            await runQuery(insertSql, [name, countryCode, district, population]);
            res.redirect('/admin/set-capital-form');
        } catch (error) {
            req.flash('error', 'Failed to add city: ' + error.message);
            res.redirect('/admin/add-city-form');
        }
    });    
};
