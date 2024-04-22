// Module export to handle city routes

module.exports = (app, db, { checkAuthenticated }) => {
    // Define a GET route for the /cities endpoint
    app.get("/cities", checkAuthenticated, (req, res) => {
        const { cityName, continent, region, topN } = req.query;
        // Construct the SQL query to retrieve the cities and their details
        let sql = `
        SELECT city.*, country.Name AS CountryName, country.Continent, country.Region
        FROM city
        JOIN country ON city.CountryCode = country.Code
        WHERE TRUE
        `;
        // Create an empty array to store the parameters for the SQL query
        const params = [];
        
        // Add a condition to the SQL query if a cityName is provided, to filter the results
        if (cityName) {
            sql += " AND city.Name LIKE ?";
            params.push(`%${cityName}%`);
        }
        
        // Add conditions to the SQL query if a continent or region is provided, to filter the results
        if (continent) {
            sql += " AND country.Continent = ?";
            params.push(continent);
        }

        // Add conditions to the SQL query if a continent or region is provided, to filter the results
        if (region) {
            sql += " AND country.Region = ?";
            params.push(region);
        }
        
        // Extend the SQL query to order the results by the population of the cities in descending order
        sql += " ORDER BY city.Population DESC";

        // Add a condition to the SQL query if topN is provided, to limit the number of results
        if (topN) {
            const nValue = parseInt(topN, 10);
            if (isNaN(nValue) || nValue <= 0) {
                res.status(400).send("Invalid input for top N cities");
                return;
            }
            sql += ` LIMIT ${db.escape(nValue)}`;        
        }

        // Execute the SQL query with the specified parameters
        db.execute(sql, params, (err, results) => {
            if (err) {
                console.error('SQL Error:', err);
                console.error('SQL Statement:', sql);
                console.error('SQL Parameters:', params);
                res.status(500).send("Server Error");
                return;
            }
            // If the query is successful, send the retrieved data to the 'city' Pug template for rendering
            res.render("city", {
                cities: results,
                user: req.user, 
                isAuthenticated: req.isAuthenticated()
            });
        });
    });

    // Route for fetching continents
    app.get("/continents", (req, res) => {
        // SQL query to retrieve distinct continents from the database
        const sql = "SELECT DISTINCT Continent FROM country ORDER BY Continent";
        db.execute(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                res.json(results.map(item => item.Continent));
            }
        });
    });

    // Route for fetching regions based on a continent
    app.get("/regions/:continent", (req, res) => {
        const { continent } = req.params;
        // SQL query to retrieve distinct regions based on the specified continent
        const sql = "SELECT DISTINCT Region FROM country WHERE Continent = ? ORDER BY Region";
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
