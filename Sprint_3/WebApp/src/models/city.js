// Module export to handle city routes
module.exports = (app, db) => {
    // Define a GET route for the /cities endpoint
    app.get("/cities", (req, res) => {
        // Retrieve the cityName from the query string if it exists
        const cityName = req.query.cityName;
        
        // Initialize the base SQL query to retrieve city information and join with country to get country names
        let sql = `
        SELECT city.*, country.Name AS CountryName
        FROM city
        JOIN country ON city.CountryCode = country.Code
        WHERE TRUE
        `;
        
        // Initialize an empty array to hold query parameters for SQL execution
        const params = [];
        
        // If cityName is provided, add a WHERE clause to the SQL statement to filter cities
        if (cityName) {
            sql += " AND city.`Name` LIKE ?";
            // Push the cityName wrapped with '%' for a LIKE wildcard search into the parameters array
            params.push('%' + cityName + '%');
        }
        
        // Append an ORDER BY clause to sort the results by city population in descending order
        sql += " ORDER BY city.Population DESC";
        
        // Execute the prepared SQL query with the provided parameters
        db.execute(sql, params, (err, results) => {
            if (err) {
                // Log the error to the console and send a server error response to the client
                console.error(err);
                res.status(500).send("Server Error");
                return;
            }
            
            // If no error occurs, render the city template and pass the query results to it
            // The cities property will be available in the Pug template for iteration
            res.render("city", { cities: results });
        });
    });
};
