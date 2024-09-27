const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection using a connection pool
const con = mysql.createPool({
    connectionLimit: 10, // Maximum number of connections in the pool
    host: "localhost",   // Ensure this is correct (use 127.0.0.1 if needed)
    user: "root",        // Your MySQL username
    password: "",        // Your MySQL password (blank if none)
    database: "akrjdatabase"  // Ensure this database exists
});

// Test the connection when the server starts
con.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully.');
        connection.release(); // Release the connection back to the pool
    }
});

// Register endpoint
app.post('/register', (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body;

    // Validate input fields
    if (!firstname || !lastname || !email || !mobile || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // SQL query to insert data
    const sql = "INSERT INTO signup (firstname, lastname, email, mobile, password) VALUES (?, ?, ?, ?, ?)";
    const values = [firstname, lastname, email, mobile, password]; // Store plain password

    // Execute SQL query
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "SQL Error occurred." });
        }
        res.status(200).json({ success: true, message: "Registration successful" });
    });
});

// Login endpoint
// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    console.log("Login attempt for email:", email);

    // SQL query to check if the user exists with the given email
    const sql = "SELECT * FROM signup WHERE Email = ?";
    const values = [email];

    // Execute the SQL query
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "A database error occurred during login. Please try again." });
        }

        console.log("Query result:", result); // Log the entire result object

        if (result.length === 0) {
            console.log("User not found for Email:", email);
            return res.status(401).json({ success: false, message: "Email not found." });
        }

        const storedPassword = result[0].Password;
        console.log("Stored password:", storedPassword); // Check if this logs the expected password

        if (storedPassword === password) {
            console.log("Login successful for:", email);
            return res.json({ success: true, message: "Login successful!" });
        } else {
            console.log("Password mismatch");
            return res.status(401).json({ success: false, message: "Email or password is incorrect." });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
