// This file contains the routes to delete a language from the database
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin');

module.exports = function(app) {
    // Route to render the form for deleting a language
    app.get('/admin/delete-language-form', checkAdmin, (req, res) => {
        res.render('deleteLanguage', {
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            messages: {
                error: req.flash('error')
            }
        });
    });

    // Handle the POST request to delete a language
    app.post('/delete-language', checkAdmin, async (req, res) => {
        const { language, countryCode } = req.body;
        try {
            // Delete the language from the database
            await runQuery("DELETE FROM countrylanguage WHERE Language = ? AND CountryCode = ?", [language, countryCode]);
            res.redirect('/admin/delete-city-form');
        } catch (error) {
            req.flash('error', 'Failed to delete language: ' + error.message);
            res.redirect('/admin/delete-language-form');
        }
    });
};
