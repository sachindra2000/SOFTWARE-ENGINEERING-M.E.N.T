require('dotenv').config(); // Load environment variables from .env file
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { runQuery } = require('../helpers/runQuery');

function initialize(passport) {
    // Function to authenticate a user
    const authenticateUser = async (email, password, done) => {
        try {
            const users = await runQuery('SELECT * FROM users WHERE email = ?', [email]);
            const user = users[0]; // Email is unique
            // Check if user exists
            if (!user) {
                return done(null, false, { message: "There's no account associated with this email" });
            }
            // Check if password is correct
            if (await bcrypt.compare(password, user.hash)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        // Catch any errors that occurred during the process
        } catch (e) {
            return done(e);
        }
    };
    // Use local strategy with custom authentication function
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    
    // Serialize and deserialize user
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            // Find user by id
            const users = await runQuery('SELECT id, email, isAdmin FROM users WHERE id = ?', [id]);
            const user = users[0]; // Id is unique
            if (user) {
                // Include the isAdmin property
                done(null, { id: user.id, email: user.email, isAdmin: user.isAdmin });
            } else {
                done(new Error('User not found'), null);
            }
        } catch (e) {
            done(e, null);
        }
    });
}

module.exports = initialize;


