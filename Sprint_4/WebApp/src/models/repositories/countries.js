// This file contains the routes for adding a new country
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin'); // Import checkAdmin middleware

module.exports = function(app) {
    // Route to render the form for adding a new country
    app.get('/admin/add-country-form', checkAdmin, (req, res) => {
        res.render('addCountry', {
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            messages: {
                error: req.flash('error')
            }
        });
    });

    // Handle the POST request to add a new country
    app.post("/add-country", async (req, res) => {
        const { code, name, continent, region, population } = req.body;
        try {
            // Check if country already exists
            const existsSql = "SELECT Code FROM country WHERE Code = ? OR Name = ?";
            const exists = await runQuery(existsSql, [code, name]);
            if (exists.length > 0) {
                req.flash('error', 'Country already exists with the same code or name.');
                return res.redirect('/admin/add-country-form');
            }
            // Insert the new country into the database
            const insertSql = "INSERT INTO country (Code, Name, Continent, Region, Population) VALUES (?, ?, ?, ?, ?)";
            await runQuery(insertSql, [code, name, continent, region, population]);
            res.redirect("/admin/add-city-form");
        } catch (error) {
            req.flash('error', 'Failed to add country: ' + error.message);
            res.redirect('/admin/add-country-form');
        }
    });
};    