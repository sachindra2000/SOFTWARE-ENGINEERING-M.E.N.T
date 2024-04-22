// Module to handle population-related routes
module.exports = (app, db) => {
    // GET route for '/populations' URL path
    app.get("/populations", (req, res) => {
        // Extract the 'continent' parameter from the query string if it exists
        const continent = req.query.continent;

        // Initialise the SQL query for computing population statistics
        let sql = `
            SELECT 
                co.Continent, 
                SUM(co.Population) AS TotalPopulation,
                (SELECT SUM(ci.Population) FROM city ci WHERE ci.CountryCode IN (SELECT Code FROM country WHERE Continent = co.Continent)) AS CityPopulation
            FROM country co
        `;

        // Array to hold parameters for the SQL query
        const params = [];

        // Append WHERE clause if 'continent' query parameter is present
        if (continent) {
            sql += " WHERE co.Continent LIKE ?";
            params.push(`%${continent}%`);
        }

        // Finalize the SQL query with a GROUP BY clause
        sql += " GROUP BY co.Continent";

        // Execute the SQL query with parameter substitution
        db.query(sql, params, (err, results) => {
            if (err) {
                // Log the error to the console and send an HTTP 500 response
                console.error("Error fetching population report:", err);
                return res.status(500).send("Server Error");
            }

            // Map the raw query results to a structured object array
            const reports = results.map(report => ({
                Continent: report.Continent, // Continent name
                TotalPopulation: report.TotalPopulation ? parseInt(report.TotalPopulation).toLocaleString() : '0', // Convert to integer and then to string with commas, or default to '0'
                CityPopulation: report.CityPopulation ? parseInt(report.CityPopulation).toLocaleString() : '0', // Convert and format, or default to '0'
                NonCityPopulation: (report.TotalPopulation - (report.CityPopulation || 0)) ? parseInt((report.TotalPopulation - (report.CityPopulation || 0))).toLocaleString() : '0', // Convert and format, or default to '0'
            }));
            

            // Render the 'populations' Pug template with the mapped data
            res.render("populations", { reports });
        });
    });
};
