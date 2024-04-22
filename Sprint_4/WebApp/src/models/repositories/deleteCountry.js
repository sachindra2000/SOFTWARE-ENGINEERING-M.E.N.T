// This file contains the routes to delete a country and all associated data (cities and languages) from the database.
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin');

module.exports = function(app) {
    // Route to render the form for deleting a country
    app.get('/admin/delete-country-form', checkAdmin, (req, res) => {
        res.render('deleteCountry', {
            user: req.user,
            isAuthenticated: req.isAuthenticated()
        });
    });

    // Handle the POST request to delete a country
    app.post('/delete-country', checkAdmin, async (req, res) => {
        const { countryCode } = req.body;
        try {
            // Delete all languages for the country
            await runQuery("DELETE FROM countrylanguage WHERE CountryCode = ?", [countryCode]);
            // Delete all cities for the country
            await runQuery("DELETE FROM city WHERE CountryCode = ?", [countryCode]);
            // Finally, delete the country itself
            await runQuery("DELETE FROM country WHERE Code = ?", [countryCode]);

            res.redirect('/');
        } catch (error) {
            req.flash('error', 'Failed to delete country: ' + error.message);
            res.redirect('/admin/delete-country-form');
        }
    });
};
