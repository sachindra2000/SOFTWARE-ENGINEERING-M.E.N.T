// Define the contact form routes

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// GET route for the contact form
router.get('/contact', (req, res) => {
    res.render('contact', {
        query: req.query || {}, // Ensures query is always an object
        success: req.flash('success'),
        error: req.flash('error'),
        isAuthenticated: req.isAuthenticated(),
    });
});

// POST route for the contact form
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Validate the input
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Your Gmail address
            pass: process.env.GMAIL_APP_PASSWORD // Your App Password
        }
    });
  
    try {
        // Send the email
        await transporter.sendMail({
            replyTo: email, // The sender's email address from the contact form
            to: process.env.GMAIL_USER,
            subject: 'Population Data User Message',
            text: message,
            html: `<b>Message from ${name}:</b><p>${message}</p>`,
        });
    
        console.log('Email sent.');
        req.flash('success', 'Your message was successfully sent!');
        res.redirect('/contact?success=true'); // Redirect to the pug file where a timeout will display the success message for 5 seconds
      } catch (error) {
        console.error('Error sending email:', error);
        req.flash('error', 'There was an error sending your message. Please try again later.');
        res.redirect('/contact'); // Redirect to the form page
    }
});

module.exports = router;
