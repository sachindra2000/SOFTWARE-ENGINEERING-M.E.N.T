// Module export to handle country routes
module.exports = (app, db) => {
    app.get("/countries", (req, res) => {  // Define a new route for /countries
        const { countryName } = req.query;  // Destructure the countryName from the query string
        // Define the SQL query to get the countries data and their capitals
        let sql = `  
        SELECT country.*, city.Name AS CapitalName 
        FROM country 
        LEFT JOIN city ON country.Capital = city.ID
        WHERE TRUE
        `;

        const params = [];  // Create an array to store any parameters that are need it to pass to the query
        
        // Define the SQL query to search for a country by name
        if (countryName) {
            sql += " AND country.`Name` LIKE ?";
            params.push('%' + countryName + '%');
        }        
        
        sql += " ORDER BY country.Population DESC"; 
        // Execute the query
        db.execute(sql, params, (err, results, fields) => {
            if (err) {
            console.error(err);
            res.status(500).send("Server Error");
            } else {
            const formattedResults = results.map(country => ({  // Map the results to a new array of objects
                ...country,  // Spread the country object into this new object
                SurfaceArea: Number(country.SurfaceArea).toLocaleString(),  // Format the surface area number with commas
                Population: Number(country.Population).toLocaleString(),  // Format the population number with commas
                LifeExpectancy: country.LifeExpectancy ? country.LifeExpectancy.toLocaleString() : 'N/A',  // Handle the case where the life expectancy might be NULL
                CapitalName: country.CapitalName || 'N/A'  // Handle the case where the capital name might be NULL
            }));
    
            res.render("country", { countries: formattedResults });  // Render the country page, passing the formatted results as a variable
            }
        });
    });
  };
  
  