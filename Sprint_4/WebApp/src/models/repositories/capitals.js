// This file contains the routes for setting a capital in the database
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin');

module.exports = function(app) {
    // Route to render form for setting a capital
    app.get('/admin/set-capital-form', checkAdmin, (req, res) => {
        res.render('addCapital', {
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            messages: {
                error: req.flash('error') // This will retrieve the flash message
            }
        });
    });

    // Route to handle setting a capital
    app.post('/add-capital', checkAdmin, async (req, res) => {
        const { countryCode, cityName } = req.body;
        try {
            // First, find the city ID from the city name and country code
            const cityResult = await runQuery("SELECT ID FROM city WHERE Name = ? AND CountryCode = ?", [cityName, countryCode]);
            // If no city is found, redirect back to the form with an error message
            if (cityResult.length === 0) {
                req.flash('error', "No city found with the provided name and country code.");
                return res.redirect('/admin/set-capital-form');
            }
            // Get the city ID
            const cityId = cityResult[0].ID;
    
            // Check if the country already has a different capital set
            const capitalCheck = await runQuery("SELECT Capital FROM country WHERE Code = ?", [countryCode]);
            if (capitalCheck.length > 0 && capitalCheck[0].Capital && capitalCheck[0].Capital !== cityId) {
                req.flash('error', "This country already has a different capital.");
                return res.redirect('/admin/set-capital-form');
            }
    
            // Update the capital in the country table
            await runQuery("UPDATE country SET Capital = ? WHERE Code = ?", [cityId, countryCode]);
            // Redirect to the next form
            res.redirect('/admin/add-language-form');
        } catch (error) {
            req.flash('error', "Failed to set capital: " + error.message);
            res.redirect('/admin/set-capital-form');
        }
    });    
};
