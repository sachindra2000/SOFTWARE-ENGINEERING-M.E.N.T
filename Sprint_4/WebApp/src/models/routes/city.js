// Module export to handle city routes
module.exports = (app, db, { checkAuthenticated }) => {
    // Define a GET route for the /cities endpoint
    app.get("/cities", checkAuthenticated, (req, res) => {
        const { cityName, continent, region, country, district, topN } = req.query;

        let sql = `
        SELECT city.*, country.Name AS CountryName, country.Continent, country.Region
        FROM city
        JOIN country ON city.CountryCode = country.Code
        WHERE TRUE
        `;

        const params = [];
        
        if (cityName) {
            sql += " AND city.Name LIKE ?";
            params.push(`%${cityName}%`);
        }
        if (continent) {
            sql += " AND country.Continent = ?";
            params.push(continent);
        }
        if (region) {
            sql += " AND country.Region = ?";
            params.push(region);
        }
        if (country) {
            sql += " AND country.Name = ?";
            params.push(country);
        }
        if (district) {
            sql += " AND city.District = ?";
            params.push(district);
        }
        sql += " ORDER BY city.Population DESC";

        if (topN) {
            const nValue = parseInt(topN, 10);
            if (isNaN(nValue) || nValue <= 0) {
                res.status(400).send("Invalid input for top N cities");
                return;
            }
            sql += ` LIMIT ${db.escape(nValue)}`;
        }

        db.execute(sql, params, (err, results) => {
            if (err) {
                console.error('SQL Error:', err);
                res.status(500).send("Server Error");
                return;
            }
            
            res.render("city", {
                cities: results,
                isAuthenticated: req.isAuthenticated()
            });
        });
    });

    // Fetch all continents
    app.get("/continents", (req, res) => {
        const sql = "SELECT DISTINCT Continent FROM country ORDER BY Continent";
        db.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                res.json(results.map(item => item.Continent));
            }
        });
    });

    // Fetch all regions
    app.get("/regions", (req, res) => {
        const sql = "SELECT DISTINCT Region FROM country ORDER BY Region";
        db.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server Error");
            } else {
                res.json(results.map(item => item.Region));
            }
        });
    });

    app.get("/country_route", (req, res) => {
        const sql = "SELECT DISTINCT Name FROM country ORDER BY Name";
        db.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Server Error");
            }
            res.json(results.map(item => item.Name));
        });
    });

    // Fetch all districts
    app.get("/districts", (req, res) => {
        const sql = "SELECT DISTINCT District FROM city ORDER BY District";
        db.query(sql, [], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Server Error");
            }
            res.json(results.map(item => item.District));
        });
    });
};
