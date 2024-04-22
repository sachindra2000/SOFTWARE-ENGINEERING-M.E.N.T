// Middleware to check if user is an admin

// Redirect to home page if user is not an admin
function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } else {
        return res.redirect("/"); // Redirect to home page if not an admin
    }
}

module.exports = checkAdmin;