const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const initializePassport = require('./passport-config');

module.exports = function(app, db) {
    // Add routes for login and registration
    app.post('/register', async (req, res) => {
        console.log('Registered user:', req.body.email);
        const { email, password, password2 } = req.body;

        // Validate registration input
        if (!email || !password || password !== password2) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }

        try {
            // Check if user already exists
            db.promise().execute('SELECT * FROM users WHERE email = ?', [email])
                .then(([existingUser]) => {
                    if (existingUser.length > 0) {
                        req.flash('error', 'Email already in use');
                        return res.redirect('/register');
                    } else {
                        // Hash password and insert new user
                        return bcrypt.hash(password, 8)
                            .then(hashedPassword => {
                                return db.promise().execute(
                                    'INSERT INTO users (email, hash) VALUES (?, ?)',
                                    [email, hashedPassword]
                                );
                            })
                            .then(([result]) => {
                                res.redirect('/login');
                            });
                    }
                })
                // Catch any errors that occurred during the process
                .catch((error) => {
                    console.error("Error executing user existence check or insert:", error);
                    req.flash('error', 'An error occurred during registration');
                    return res.redirect('/register');
                });

        } catch (error) {
            console.error("Registration Error:", error);
            req.flash('error', 'Server error during registration. Please try again.');
            res.redirect('/register');
        }
    });

    // Add session and passport middleware
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // Define functions to get user by email
    const getUserByEmail = async (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    };

    // Define function to get user by id
    const getUserById = (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            });
        });
    };

    // Initialize passport
    initializePassport(
        passport,
        getUserByEmail,
        getUserById
    );

    // Define routes for login
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true // Enable flash messages
    }));

    app.get('/login', (req, res) => {
        res.render('login', { message: req.flash('error') });
    });

    // Define route for registering
    app.get('/register', (req, res) => {
        res.render('register', { message: req.flash('error') });
    });
};