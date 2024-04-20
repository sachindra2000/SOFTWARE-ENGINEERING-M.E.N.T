// Module to handle population-related routes
module.exports = (app, db, { checkAuthenticated }) => {
    // GET route for '/populations' URL path
    app.get("/populations", checkAuthenticated, (req, res) => {
        const viewBy = req.query.viewBy || 'Continent'; // Default to 'Continent' if not specified

        let sql = '';
        const params = [];

        switch (viewBy) {
            case 'Continent':
                sql = `
                    SELECT 
                        co.Continent AS Name, 
                        SUM(co.Population) AS TotalPopulation,
                        (SELECT SUM(ci.Population) FROM city ci INNER JOIN country c ON ci.CountryCode = c.Code WHERE c.Continent = co.Continent) AS CityPopulation
                    FROM country co
                    GROUP BY co.Continent
                    ORDER BY TotalPopulation DESC
                `;
                break;
            case 'Country':
                sql = `
                    SELECT 
                        co.Name, 
                        co.Population AS TotalPopulation,
                        (SELECT SUM(ci.Population) FROM city ci WHERE ci.CountryCode = co.Code) AS CityPopulation
                    FROM country co
                    ORDER BY TotalPopulation DESC
                `;
                break;
            case 'Region':
                sql = `
                    SELECT 
                        co.Region AS Name, 
                        SUM(co.Population) AS TotalPopulation,
                        (SELECT SUM(ci.Population) FROM city ci INNER JOIN country c ON ci.CountryCode = c.Code WHERE c.Region = co.Region) AS CityPopulation
                    FROM country co
                    GROUP BY co.Region
                    ORDER BY TotalPopulation DESC
                `;
                break;
        }

        // Execute the query
        db.query(sql, params, (err, results) => {
            if (err) {
                console.error("Error fetching population report:", err);
                return res.status(500).send("Server Error");
            }

            const reports = results.map((result) => ({
                Name: result.Name,
                TotalPopulation: result.TotalPopulation ? result.TotalPopulation.toLocaleString() : '0', // Check for null before formatting
                CityPopulation: result.CityPopulation ? result.CityPopulation.toLocaleString() : '0', // Check for null before formatting
                NonCityPopulation: (result.TotalPopulation - result.CityPopulation) >= 0 
                    ? (result.TotalPopulation - result.CityPopulation).toLocaleString() 
                    : '0', // Calculate and format, ensuring non-negative result
            }));

            res.render("populations", {
                reports: reports,
                viewBy: viewBy,
                isAuthenticated: req.isAuthenticated()
            });
        });
    });
};
