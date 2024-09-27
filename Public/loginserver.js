const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

// Database connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "akrjdatabase",  // Replace this with your actual database name
});

con.connect(function(err) {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to the database!");
});

// CORS middleware
const cors = require('cors');
app.use(cors());

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    console.log("Login attempt for email:", email);

    // SQL query to check if the user exists with the given email and password in the users table
    const sql = "SELECT * FROM signup WHERE email = ? AND password = ?";  // Replace with your actual table and column names
    const values = [email, password];

    // Execute the SQL query
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "Database error." });
        }

        // Check if user found
        if (result.length > 0) {
            res.json({ success: true, message: "Login successful!" });
        } else {
            res.json({ success: false, message: "Invalid email or password." });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
