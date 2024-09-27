const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; 

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "akrjdatabase"
});

// Connect to the database
con.connect(function(err) {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to the database!");
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
    const values = [firstname, lastname, email, mobile, password];

    // Execute SQL query
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "SQL Error occurred." });
        }
        res.status(200).json({ success: true, message: "Registration successful" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
