// Module export to handle capital routes

module.exports = (app, db, { checkAuthenticated }) => {
    // Route for fetching capital cities
    app.get("/capitals", checkAuthenticated, (req, res) => {
        // Retrieving the capitalName from the query parameters if it exists
        const { capitalName, continent, region, topN } = req.query;

        // Constructing the SQL query to retrieve the capital cities and their details
        let sql = `
        SELECT city.ID, city.Name, country.Name AS CountryName, city.Population
        FROM city
        JOIN country ON city.ID = country.Capital
        WHERE TRUE
        `;

        // Creating an empty array to store the parameters for the SQL query
        const params = [];

        // Adding a condition to the SQL query if a capitalName is provided, to filter the results
        if (capitalName) {
            sql += " AND city.Name LIKE ?";
            params.push(`%${capitalName}%`);
        }
        // Adding conditions to the SQL query if a continent or region is provided, to filter the results
        if (continent) {
            sql += " AND country.Continent = ?";
            params.push(continent);
        }
        // Adding conditions to the SQL query if a continent or region is provided, to filter the results
        if (region) {
            sql += " AND country.Region = ?";
            params.push(region);
        }

        // Extending the SQL query to order the results by the population of the cities in descending order
        sql += " ORDER BY city.Population DESC";

        // Adding a condition to the SQL query if topN is provided, to limit the number of results
        if (topN) {
            const nValue = parseInt(topN, 10);
            if (isNaN(nValue) || nValue <= 0) {
                res.status(400).send("Invalid input for top N capitals");
                return;
            }
            sql += ` LIMIT ${db.escape(nValue)}`;        
        }

        // Executing the SQL query with the specified parameters
        db.execute(sql, params, (err, results) => {
            if (err) {
                // If there's an error during the query, log it to the console
                console.error(err);
                res.status(500).send("Server Error");
                return;
            }
            // If the query is successful, send the retrieved data to the 'capital' Pug template for rendering
            res.render("capital", {
                capitals: results,
                user: req.user, 
                isAuthenticated: req.isAuthenticated()
            });
        });
    });

     // Route for fetching continents
     app.get("/continents", (req, res) => {
        // Constructing the SQL query to retrieve the list of continents
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
        // Constructing the SQL query to retrieve the list of regions based on the specified continent
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
