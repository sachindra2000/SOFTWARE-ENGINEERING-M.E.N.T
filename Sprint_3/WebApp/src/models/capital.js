// Exporting a module that defines the route for getting capital cities
module.exports = (app, db) => {
    // Setting up a GET route for the path '/capitals'
    app.get("/capitals", (req, res) => {
        // Retrieving the capitalName from the query parameters if it exists
        const capitalName = req.query.capitalName;

        // The query joins the 'city' table with the 'country' table to access the country name
        let sql = `
        SELECT city.ID, city.Name, country.Name AS CountryName, city.Population
        FROM city
        JOIN country ON city.ID = country.Capital
        WHERE TRUE
        `;

        // Initializing an array to store any query parameters for use in the SQL execution
        const params = [];

        // Adding a condition to the SQL query if a capitalName is provided, to filter the results
        if (capitalName) {
            sql += " AND city.Name LIKE ?";
            // Adding the user's search term into the parameters array, wrapped in percent signs for partial matching
            params.push(`%${capitalName}%`);
        }

        // Extending the SQL query to order the results by the population of the cities in descending order
        sql += " ORDER BY city.Population DESC";

        // Performing the SQL query with the specified parameters
        db.execute(sql, params, (err, results) => {
            if (err) {
                // If there's an error during the query, log it to the console and send a server error response to the client
                console.error(err);
                res.status(500).send("Server Error");
                return;
            }

            // If the query is successful, send the retrieved data to the 'capital' Pug template for rendering
            res.render("capital", { capitals: results });
        });
    });
};
