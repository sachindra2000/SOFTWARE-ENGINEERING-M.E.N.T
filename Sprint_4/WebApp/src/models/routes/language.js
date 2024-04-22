// Module to handle language-related routes and queries

module.exports = (app, db, { checkAuthenticated }) => {
    // Define a GET route for the /language endpoint
    app.get("/language", checkAuthenticated, (req, res) => {
        // List of languages to display data for
        const languagesList = ['Chinese', 'English', 'Hindi', 'Spanish', 'Arabic'];

        // SQL query to get the total world population
        const sqlWorldPop = `SELECT SUM(Population) AS TotalPopulation FROM country`;

        // SQL query to get the number of speakers and the percentage for each language
        const sqlLanguages = `
            SELECT Language, SUM(Population * Percentage / 100) AS Speakers
            FROM countrylanguage
            JOIN country ON countrylanguage.CountryCode = country.Code
            WHERE Language IN (?)
            GROUP BY Language
            ORDER BY SUM(Population * Percentage / 100) DESC
        `;

        // Execute query to get the total world population
        db.query(sqlWorldPop, (err, worldPopResults) => {
            if (err) {
                console.error("Error fetching world population:", err);
                return res.status(500).send("Server Error");
            }

            // Store the total world population
            const totalWorldPopulation = worldPopResults[0].TotalPopulation;

            // Execute query to get the language data
            db.query(sqlLanguages, [languagesList], (err, languageResults) => {
                if (err) {
                    console.error("Error fetching languages:", err);
                    return res.status(500).send("Server Error");
                }

                // Process the language data for the response
                const languagesData = languageResults.map((language, index) => ({
                    SNo: index + 1, // Serial number
                    Language: language.Language, // Language name
                    Speakers: parseInt(language.Speakers, 10), // Number of speakers formatted as an integer
                    Percentage: (language.Speakers / totalWorldPopulation) * 100 // Calculate the percentage of world population
                }));

                // Render the 'language' Pug template with the processed language data
                res.render("language", {
                    languages: languagesData,
                    user: req.user, 
                    isAuthenticated: req.isAuthenticated()
                });
            });
        });
    });
};
