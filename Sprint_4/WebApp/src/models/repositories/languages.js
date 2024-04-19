// This file contains the routes for adding a new language to the database
const { runQuery } = require('../helpers/runQuery');
const checkAdmin = require('../helpers/checkAdmin'); // Import checkAdmin middleware

module.exports = function(app) {
    // Route to render the form for adding a new language
    app.get('/admin/add-language-form', checkAdmin, (req, res) => {
        res.render('addLanguage', {
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            messages: {
                error: req.flash('error')
            }
        });
    });

    // Handle the POST request to add a new language
    app.post("/add-language", async (req, res) => {
        const { countryCode, language, isOfficial, percentage } = req.body;
        try {
            // Check if language entry already exists
            const existsSql = "SELECT * FROM countrylanguage WHERE CountryCode = ? AND Language = ?";
            const exists = await runQuery(existsSql, [countryCode, language]);
            if (exists.length > 0) {
                req.flash('error', 'This language is already registered for this country.');
                return res.redirect('/admin/add-language-form');
            }
            
            // Insert the new language into the database
            const insertSql = "INSERT INTO countrylanguage (CountryCode, Language, IsOfficial, Percentage) VALUES (?, ?, ?, ?)";
            await runQuery(insertSql, [countryCode, language, isOfficial, percentage]);
            res.redirect("/");
        } catch (error) {
            req.flash('error', 'Failed to add language: ' + error.message);
            res.redirect('/admin/add-language-form');
        }
    });    
};
