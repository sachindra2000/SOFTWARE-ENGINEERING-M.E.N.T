// Routes for fetching countries with optional search by country name, continent, and region

module.exports = (app, db, { checkAuthenticated, checkAdmin  }) => {
    // Define a GET route for the /countries endpoint
    app.get("/countries", checkAuthenticated, (req, res) => {
        const { countryName, continent, region, topN } = req.query;

        // Construct the SQL query to retrieve the countries and their details
        let sql = `
        SELECT country.*, city.Name AS CapitalName 
        FROM country 
        LEFT JOIN city ON country.Capital = city.ID
        WHERE TRUE
        `;
        // Create an empty array to store the parameters for the SQL query
        const params = [];

        // Add a condition to the SQL query if a countryName is provided, to filter the results
        if (countryName) {
            sql += " AND country.`Name` LIKE ?";
            params.push('%' + countryName + '%');
        }

        // Add conditions to the SQL query if a continent or region is provided, to filter the results
        if (continent) {
            sql += " AND country.`Continent` = ?";
            params.push(continent);
        }

        // Add conditions to the SQL query if a continent or region is provided, to filter the results
        if (region) {
            sql += " AND country.`Region` = ?";
            params.push(region);
        }

        sql += " ORDER BY country.Population DESC";

        // Add a condition to the SQL query if topN is provided, to limit the number of results
        if (topN) {
            const nValue = parseInt(topN, 10);
            if (isNaN(nValue) || nValue <= 0) {
                res.status(400).send("Invalid input for top N countries");
                return;
            }
            sql += ` LIMIT ${db.escape(nValue)}`;        
        }

        // Execute the SQL query with the specified parameters
        db.execute(sql, params, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                // Format the results to include commas in the population and surface area numbers
                const formattedResults = results.map(country => ({
                    ...country,
                    SurfaceArea: Number(country.SurfaceArea).toLocaleString(),
                    Population: Number(country.Population).toLocaleString(),
                    CapitalName: country.CapitalName || 'N/A'
                }));
                res.render("country", {
                    countries: formattedResults,
                    user: req.user,
                    isAuthenticated: req.isAuthenticated()
                });
            }
        });
    });

    // New route for fetching continents
    app.get("/continents", (req, res) => {
        // Constructing the SQL query to retrieve the list of continents
        const sql = "SELECT DISTINCT `Continent` FROM country ORDER BY `Continent`";
        db.execute(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                res.json(results.map(item => item.Continent));
            }
        });
    });

    // New route for fetching regions based on a continent
    app.get("/regions/:continent", (req, res) => {
        const { continent } = req.params;
        // Constructing the SQL query to retrieve the list of regions based on the specified continent
        const sql = "SELECT DISTINCT `Region` FROM country WHERE `Continent` = ? ORDER BY `Region`";
        db.execute(sql, [continent], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                res.json(results.map(item => item.Region));
            }
        });
    });
};
