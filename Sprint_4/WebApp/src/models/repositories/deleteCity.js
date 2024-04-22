// Initiate the delete city form and delete the city from the database
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin');

module.exports = function(app) {
    // Route to render the form for deleting a city
    app.get('/admin/delete-city-form', checkAdmin, (req, res) => {
        res.render('deleteCity', {
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    });
    
// Handle the POST request to delete a city
app.post('/delete-city', checkAdmin, async (req, res) => {
    const { cityName, countryCode } = req.body;
    try {
        // Find the city ID from the city name and country code
        const cityResult = await runQuery("SELECT ID FROM city WHERE Name = ? AND CountryCode = ?", [cityName, countryCode]);
        
        if (cityResult.length === 0) {
            req.flash('error', "City not found or does not match the country code.");
            return res.redirect('/admin/delete-city-form');
        }
        
        const cityId = cityResult[0].ID;

        // Check if the city is a capital
        const capitalCheck = await runQuery("SELECT Code FROM country WHERE Capital = ?", [cityId]);
        if (capitalCheck.length > 0) {
            // Update the country to remove the capital since it's being deleted
            await runQuery("UPDATE country SET Capital = NULL WHERE Capital = ?", [cityId]);
        }

        // Delete the city from the database
        await runQuery("DELETE FROM city WHERE ID = ?", [cityId]);
        res.redirect('/admin/delete-country-form'); // Proceed to delete country
    } catch (error) {
        req.flash('error', 'Failed to delete city: ' + error.message);
        res.redirect('/admin/delete-city-form');
    }
});
};


