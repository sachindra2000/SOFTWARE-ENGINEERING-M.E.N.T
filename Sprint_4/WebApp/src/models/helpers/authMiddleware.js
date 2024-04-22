// Auth middleware to check if user is authenticated or not

// Redirect to login page if user is not authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Redirect to home page if user is already authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
